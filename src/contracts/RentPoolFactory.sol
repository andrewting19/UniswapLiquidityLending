pragma solidity >= 0.7.6;

import './interfaces/IRentPoolFactory.sol';

contract RentPoolFactory is IRentPoolFactory {


    address feeToSetter;
    address feeTo;


    mapping(address => address) public getUniswapV3Pool;
    address[] public allPools;

    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }


    function createPool(address uniswapPool) external returns (address) {
        return address(0);
    }

    function allPoolsLength() external view returns (uint) {
        return allPools.length;
    }



    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'UniswapV2: FORBIDDEN');
        feeToSetter = _feeToSetter;
    }




} 