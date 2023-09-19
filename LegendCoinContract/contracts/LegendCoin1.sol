// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract Legend is Context, AccessControlEnumerable, ERC20, ReentrancyGuard {
    address public addrees0 = address(0);
    uint256 public totalClaimPromoteReward;
    uint256 public lockTime = 365 * 1 days;
    uint256 public rewardsPerHourA = 2083; // 0.05%/d
    uint256 public rewardsPerHourB = 5000; // 0.12/d
    uint256 public rewardsPerHourC = 11250; // 0.27/d or 25% APR
    uint256 public totalStake;
    uint256 public totalClaimStakeReward;
    uint256 public minStake = 2000000 * 10**18;
    uint256 public airDropPrice = 400 * 10**13;
    uint256 public airDropAmount = 500 * 10**18;
    uint256 public totalAirDropAmount;
    uint256 public totalAirDropTimes;
    bool public airDropAble = true;
    address public community = 0x8aBc091b776357A0019cB7B69a956a2f6BEeE3a2;
    address public research = 0xA15c5aF22C3b6794ce9A8A64e62A768E1C80d534;
    address public airdrop = 0xe283BF93fcF0b0A598cc79029c7c8f5ae731ee86;
    address public promote = 0x448c8527e31C319D237D054ed5f0F6553564FD12;
    address public mining = 0x21Ac162D5394CC3D9a0af5c84109f3d16470ADB0;
    address public legend = 0xA2bf7680B95786a6efC3c3F50570B3d702755e74;
    bytes32 public constant FORK_ROLE = keccak256("FORK_ROLE");
    mapping(address => address) public promoter;
    mapping(address => address[]) public promoted;
    mapping(address => uint256) public promotedRewardAmount;
    mapping(address => uint256) public deposited;
    mapping(address => uint256) public lastStakeTime;
    mapping(address => uint256) public unclaimedRewards;
    mapping(address => uint256) public AlreadyCliamStakeReward;
    mapping(address => bool) public alreadyAirDrop;
    mapping(address => uint256) public forkBalance;
    mapping(address => uint256) public forkTime;
    mapping(address => uint256) public alreadyClaimfork;

    constructor() ERC20("LegendCoin", "CQBI") {
        // 权限需要改一下
        _setupRole(DEFAULT_ADMIN_ROLE, legend);
    }

    function airDrop() external payable nonReentrant {
        require(airDropAble, "AirDrop");
        require(!alreadyAirDrop[_msgSender()], "Already AirDrop");
        require(msg.value == airDropPrice, "value invalid");
        payable(legend).transfer(airDropPrice);
        alreadyAirDrop[_msgSender()] = true;
        totalAirDropAmount += airDropAmount;
        totalAirDropTimes += 1;
        IERC20(address(this)).transferFrom(
            airdrop,
            _msgSender(),
            airDropAmount
        );
    }

    function fork() external nonReentrant {
        require(hasRole(FORK_ROLE, _msgSender()), "No Access");
        require(
            alreadyClaimfork[_msgSender()] < forkBalance[_msgSender()],
            "No More forkBalance"
        );
        uint256 reward = calFork(_msgSender());
        alreadyClaimfork[_msgSender()] += reward;
        IERC20(address(this)).transferFrom(airdrop, _msgSender(), reward);
    }

    function calFork(address account) public view returns (uint256 reward) {
        uint256 d = ((block.timestamp - forkTime[account]) / 60) * 60 * 24;
        if (d > 100) {
            d = 100;
        }
        reward = (forkBalance[account] * d) / 100 - alreadyClaimfork[account];
    }

    function stake(uint256 amount, address promoter_) external nonReentrant {
        require(amount >= minStake, "Amount smaller than minimimum deposit");
        require(promoter_ != _msgSender(), "Invalid promote");
        require(
            balanceOf(msg.sender) >= amount,
            "Can't stake more than you own"
        );
        address _promoter = promoter[_msgSender()];
        if (_promoter == address(0)) {
            if (promoter_ != address(0)) {
                promoter[_msgSender()] = promoter_;
                promotedRewardAmount[promoter_] += (amount * 100) / 1000;
                totalClaimPromoteReward += (amount * 100) / 1000;
                promoted[promoter_].push(_msgSender());
                IERC20(address(this)).transferFrom(
                    airdrop,
                    promoter_,
                    (amount * 100) / 1000
                );
            }
        } else {
            promotedRewardAmount[_promoter] += (amount * 100) / 1000;
            totalClaimPromoteReward += (amount * 100) / 1000;
            IERC20(address(this)).transferFrom(
                airdrop,
                _promoter,
                (amount * 100) / 1000
            );
            _promoter = promoter[_promoter];
            if (_promoter != address(0)) {
                promotedRewardAmount[_promoter] += (amount * 50) / 1000;
                totalClaimPromoteReward += (amount * 50) / 1000;
                IERC20(address(this)).transferFrom(
                    airdrop,
                    _promoter,
                    amount / 5
                );
            }
        }

        if (deposited[_msgSender()] == 0) {
            deposited[_msgSender()] = amount;
            lastStakeTime[_msgSender()] = block.timestamp;
            unclaimedRewards[_msgSender()] = 0;
        } else {
            uint256 rewards = calculateRewards(msg.sender);
            unclaimedRewards[_msgSender()] += rewards;
            deposited[_msgSender()] += amount;
            lastStakeTime[msg.sender] = block.timestamp;
        }
        totalStake += amount;
        transfer(address(this), amount);
    }

    function getPromotedAmout(address acoount) external view returns (uint256) {
        return promoted[acoount].length;
    }

    function calculateRewards(address account)
        internal
        view
        returns (uint256 rewards)
    {
        uint256 depositedAmout = deposited[account];
        if (
            depositedAmout >= 2000000 * 10**18 &&
            depositedAmout <= 5000000 * 10**18
        ) {
            return (
                ((((block.timestamp - lastStakeTime[account]) *
                    deposited[account] *
                    rewardsPerHourA) / 3600) / 100000000)
            );
        } else if (
            depositedAmout >= 5000000 * 10**18 &&
            depositedAmout < 10000000 * 10**18
        ) {
            return (
                ((((block.timestamp - lastStakeTime[account]) *
                    deposited[account] *
                    rewardsPerHourB) / 3600) / 100000000)
            );
        } else {
            return (
                ((((block.timestamp - lastStakeTime[account]) *
                    deposited[account] *
                    rewardsPerHourC) / 3600) / 100000000)
            );
        }
    }

    function claimRewards() external nonReentrant {
        uint256 rewards = calculateRewards(msg.sender) +
            unclaimedRewards[msg.sender];
        require(rewards > 0, "You have no rewards");
        unclaimedRewards[msg.sender] = 0;
        totalClaimStakeReward += rewards;
        AlreadyCliamStakeReward[_msgSender()] += rewards;
        IERC20(address(this)).transfer(msg.sender, rewards);
    }

    function withdrawAll() external nonReentrant {
        require(deposited[msg.sender] > 0, "You have no deposit");
        uint256 _rewards = calculateRewards(msg.sender) +
            unclaimedRewards[msg.sender];
        uint256 _deposit = deposited[msg.sender];
        deposited[msg.sender] = 0;
        lastStakeTime[msg.sender] = 0;
        unclaimedRewards[msg.sender] = 0;
        uint256 _amount = _rewards + _deposit;
        if (isTimeUnlock(_msgSender())) {
            _amount = (_amount * 500) / 1000;
        }
        totalClaimStakeReward += (_rewards * 500) / 1000;
        AlreadyCliamStakeReward[msg.sender] = totalClaimStakeReward;
        IERC20(address(this)).transfer(msg.sender, _amount);
    }

    function isTimeUnlock(address _account) public view returns (bool) {
        if (lastStakeTime[_account] + lockTime < block.timestamp) {
            return true;
        }
        return false;
    }

    function getRewardsAmount(address _account) public view returns (uint256) {
        if (deposited[_account] == 0) {
            return 0;
        }
        return
            unclaimedRewards[_account] +
            calculateRewards(_account) -
            AlreadyCliamStakeReward[_account];
    }

    function grantFork(address[] memory recipients, uint256[] memory balance)
        external
    {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Not DEFAULT_ADMIN_ROLE "
        );
        require(recipients.length == balance.length, "length error");
        for (uint256 i = 0; i < recipients.length; i++) {
            grantRole(FORK_ROLE, recipients[i]);
            forkBalance[recipients[i]] = balance[i];
            forkTime[recipients[i]] = block.timestamp;
        }
    }

    function setLockTime(uint256 _lockTime) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Not DEFAULT_ADMIN_ROLE "
        );
        lockTime = _lockTime;
    }

    function setStakeRule(
        uint256 _rewardsPerHourA,
        uint256 _rewardsPerHourB,
        uint256 _rewardsPerHourC
    ) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Not DEFAULT_ADMIN_ROLE "
        );
        rewardsPerHourA = _rewardsPerHourA;
        rewardsPerHourB = _rewardsPerHourB;
        rewardsPerHourC = _rewardsPerHourC;
    }

    function setPreSaleRule(
        bool _airDropAble,
        uint256 _airDropPrice,
        uint256 _airDropAmount
    ) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Not DEFAULT_ADMIN_ROLE "
        );
        airDropAble = _airDropAble;
        airDropPrice = _airDropPrice;
        airDropAmount = _airDropAmount;
    }
}
