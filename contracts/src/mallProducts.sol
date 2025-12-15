// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract mallProducts {

    struct Products {
        uint256 id;
        address seller;
        uint256 price;
        string name;
        string description;
        string image;
        bool removed;
    }

    uint256 public nextId = 0;
    uint256 public activeCount = 0;
    mapping(uint256 => Products) public products;

    /// Release a product
    function release(uint256 price, string memory name, string memory description, string memory image) external returns (uint256 id) {
        id = nextId++;
        activeCount++;
        products[id] = Products({
            id: id,
            seller: msg.sender,
            price: price,
            name: name,
            description: description,
            image: image,
            removed: false
        });
    }

    /// Remove a product
    function remove(uint256 id) external {
        require(id < nextId && id >= 0, "Wrong Index");
        Products storage p = products[id];
        require(msg.sender == p.seller, "Only seller can remove product");
        require(!p.removed, "Product in the wrong status");
        p.removed = true;
        activeCount--;
    }

    
    /// get detail of product
    function getProduct(uint256 id) external view returns (Products memory) {
        return products[id];
    }

    function getProducts() external view returns (Products[] memory) {
        Products[] memory allProducts = new Products[](activeCount);
        uint256 count = 0;
        for (uint256 i = 0; i < nextId; i++) {
            if(products[i].removed == false){
                allProducts[count++] = products[i];
            }
        }
        return allProducts;
    }
}
