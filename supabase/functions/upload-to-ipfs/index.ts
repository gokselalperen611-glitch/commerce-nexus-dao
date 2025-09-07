import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const pinataJWT = Deno.env.get('PINATA_JWT');
    if (!pinataJWT) {
      throw new Error('PINATA_JWT not configured');
    }

    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string || file.name;

    if (!file) {
      throw new Error('No file provided');
    }

    // Create FormData for Pinata API
    const pinataFormData = new FormData();
    pinataFormData.append('file', file);
    
    // Add metadata
    const pinataMetadata = JSON.stringify({
      name: name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        type: 'commerce-dao-asset'
      }
    });
    pinataFormData.append('pinataMetadata', pinataMetadata);

    // Upload to Pinata
    const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pinataJWT}`,
      },
      body: pinataFormData,
    });

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text();
      console.error('Pinata error:', errorText);
      throw new Error(`Pinata upload failed: ${pinataResponse.status} ${errorText}`);
    }

    const pinataResult = await pinataResponse.json();
    
    // Return the IPFS hash and gateway URL
    const ipfsHash = pinataResult.IpfsHash;
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    console.log('File uploaded to IPFS:', { ipfsHash, gatewayUrl, name });

    return new Response(JSON.stringify({
      success: true,
      ipfsHash,
      gatewayUrl,
      name,
      size: file.size,
      type: file.type
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in upload-to-ipfs function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});