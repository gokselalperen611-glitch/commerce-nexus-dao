// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title CommerceDAO Store Token
/// @notice Basit, güvenli, üretime uygun ERC-20 token. Mağaza token’ı olarak kullanılmak üzere tasarlanmıştır.
/// Özellikler: Mint/Burn, Pause, EIP-2612 Permit (gasless approvals)
contract CommerceDAOToken is ERC20, ERC20Burnable, ERC20Permit, Pausable, Ownable {
    /// @notice Constructor
    /// @param name_ Token adı (örn. "TechHub Token")
    /// @param symbol_ Token sembolü (örn. "TECH")
    /// @param initialSupply_ İlk arz (18 ondalık bazında, örn. 1_000_000 ether)
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_
    ) ERC20(name_, symbol_) ERC20Permit(name_) Ownable(msg.sender) {
        // İlk arzı kontrat sahibine mint et
        _mint(msg.sender, initialSupply_);
    }

    /// @notice Yeni token basma (sadece sahip)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Transferleri duraklat (sadece sahip)
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Transferleri yeniden başlat (sadece sahip)
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @dev OZ v5 ile uyumlu transfer hook'u
    function _update(address from, address to, uint256 value) internal override {
        require(!paused(), "Token: paused");
        super._update(from, to, value);
    }
}
