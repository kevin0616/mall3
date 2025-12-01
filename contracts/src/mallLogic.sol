// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract EthEscrow {
    struct Payment {
        address payer;
        address payee;
        uint256 amount;
        uint256 expiry;
        bool executed;
    }

    uint256 public nextId;
    mapping(uint256 => Payment) public payments;

    /// @notice Create a pending payment by sending ETH
    function createPending(address payee) external payable returns (uint256 id) {
        require(msg.value > 0, "Amount must be > 0");
        uint256 delaySeconds = 3600;
        id = nextId++;
        payments[id] = Payment({
            payer: msg.sender,
            payee: payee,
            amount: msg.value,
            expiry: block.timestamp + delaySeconds,
            executed: false
        });
    }

    /// @notice Cancel a pending payment before expiry
    function cancel(uint256 id) external {
        Payment storage p = payments[id];
        require(msg.sender == p.payer, "Only payer can cancel");
        require(!p.executed, "Already executed");
        require(block.timestamp < p.expiry, "Already expired");

        p.executed = true;
        payable(p.payer).call{value: p.amount}("");
    }

    /// @notice Confirm and release payment to payee after expiry
    function confirm(uint256 id) external {
        Payment storage p = payments[id];
        require(!p.executed, "Already executed");
        require(block.timestamp >= p.expiry, "Not ready yet");

        p.executed = true;
        payable(p.payee).call{value: p.amount}("");
    }

    /// @notice Get details of a payment
    function getPayment(uint256 id) external view returns (Payment memory) {
        return payments[id];
    }

    function getPayments() external view returns (Payment[] memory) {
        Payment[] memory allPayments = new Payment[](nextId);
        for (uint256 i = 0; i < nextId; i++) {
            allPayments[i] = payments[i];
        }
        return allPayments;
    }

    /// @notice Get the total ETH balance held by this contract
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
