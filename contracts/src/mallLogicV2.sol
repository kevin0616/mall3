// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract EthEscrow {

    enum Status { Pending, Confirmed, Cancelled, Finished}

    struct Payment {
        uint256 id;
        address payer;
        address payee;
        uint256 amount;
        uint256 expiry;
        Status status;
    }

    uint256 public nextId;
    mapping(uint256 => Payment) public payments;

    /// @notice Create a pending payment by sending ETH
    function createPending(address payee, uint256 delaySeconds) external payable returns (uint256 id) {
        require(msg.value > 0, "Amount must be > 0");
        id = nextId++;
        payments[id] = Payment({
            id: id,
            payer: msg.sender,
            payee: payee,
            amount: msg.value,
            expiry: block.timestamp + delaySeconds,
            status: Status.Pending
        });
    }

    /// Confirm a pending payment before expiry
    function confirm(uint256 id) external {
        Payment storage p = payments[id];
        require(msg.sender == p.payer, "Only payer can confirm");
        require(p.status == Status.Pending, "TX in the wrong status");
        require(block.timestamp < p.expiry, "Already expired");
        p.status = Status.Confirmed;
    }

    /// Cancel a pending payment before expiry
    function cancel(uint256 id) external {
        Payment storage p = payments[id];
        require(msg.sender == p.payer, "Only payer can cancel");
        require(p.status == Status.Pending, "TX in the wrong status");
        require(block.timestamp < p.expiry, "Already expired");

        p.status = Status.Cancelled;
        payable(p.payer).call{value: p.amount}("");
    }

    /// @notice Release payment to payee after expiry
    function collect(uint256 id) external {
        Payment storage p = payments[id];
        require(p.status == Status.Confirmed || (p.status == Status.Pending && block.timestamp >= p.expiry ), "TX in the wrong status");

        p.status = Status.Finished;
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
