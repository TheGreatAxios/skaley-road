// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {CrossyRoad} from "../src/CrossyRoad.sol";

contract CrossyRoadTest is Test {
    CrossyRoad public crossyRoad;

    function setUp() public {
        crossyRoad = new CrossyRoad();
    }

    function test_Move() public {
        crossyRoad.move();
        assertEq(crossyRoad.scores(address(this)), 1);
    }

    function test_StartGame() public {
        crossyRoad.move();
        assertEq(crossyRoad.scores(address(this)), 1);
        crossyRoad.startGame();
        assertEq(crossyRoad.scores(address(this)), 0);
    }
}
