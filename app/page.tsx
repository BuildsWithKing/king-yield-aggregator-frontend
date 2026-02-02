'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBlockNumber } from 'wagmi';
import { Wallet, TrendingUp, Plus, Minus, Shield, RefreshCw, AlertCircle, ChevronDown, ExternalLink, Loader2, CheckCircle, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACTS, VAULT_CORE_ABI, STRATEGY_MANAGER_ABI, REBALANCER_ABI, ERC20_ABI } from '@/lib/contracts/config';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'vault' | 'admin'>('vault');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [newStrategyAddress, setNewStrategyAddress] = useState('');
  const [strategyIdToSet, setStrategyIdToSet] = useState('');
  const [strategyToRemove, setStrategyToRemove] = useState('');
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [txStatus, setTxStatus] = useState<string>('');
  const [isApproving, setIsApproving] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data: userShares, refetch: refetchShares } = useReadContract({
    address: CONTRACTS.VAULT_CORE,
    abi: VAULT_CORE_ABI,
    functionName: 's_shares',
    args: address ? [address] : undefined,
    query: { refetchInterval: 4000 }
  });

  const { data: totalAssets, refetch: refetchTotalAssets } = useReadContract({
    address: CONTRACTS.VAULT_CORE,
    abi: VAULT_CORE_ABI,
    functionName: 'totalAssets',
    query: { refetchInterval: 4000 }
  });

  const { data: totalShares } = useReadContract({
    address: CONTRACTS.VAULT_CORE,
    abi: VAULT_CORE_ABI,
    functionName: 's_totalShares',
    query: { refetchInterval: 4000 }
  });

  const { data: tokenBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.ASSET_TOKEN,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { refetchInterval: 4000 }
  });

  const { data: tokenAllowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.ASSET_TOKEN,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.VAULT_CORE] : undefined,
    query: { refetchInterval: 4000 }
  });

  const { data: decimals } = useReadContract({
    address: CONTRACTS.ASSET_TOKEN,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  const { data: tokenSymbol } = useReadContract({
    address: CONTRACTS.ASSET_TOKEN,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  const { data: strategyAPRs, refetch: refetchAPRs } = useReadContract({
    address: CONTRACTS.STRATEGY_MANAGER,
    abi: STRATEGY_MANAGER_ABI,
    functionName: 'strategyAPRs',
    query: { refetchInterval: 5000 }
  });

  const { data: activeStrategyId, refetch: refetchActiveId } = useReadContract({
    address: CONTRACTS.STRATEGY_MANAGER,
    abi: STRATEGY_MANAGER_ABI,
    functionName: 'activeStrategyId',
    query: { refetchInterval: 5000 }
  });

  const { data: activeStrategy, refetch: refetchActiveStrategy } = useReadContract({
    address: CONTRACTS.STRATEGY_MANAGER,
    abi: STRATEGY_MANAGER_ABI,
    functionName: 'activeStrategy',
    query: { refetchInterval: 5000 }
  });

  const { data: lifetimeStrategies } = useReadContract({
    address: CONTRACTS.STRATEGY_MANAGER,
    abi: STRATEGY_MANAGER_ABI,
    functionName: 's_lifetimeStrategies',
    query: { refetchInterval: 5000 }
  });

  const { data: totalDeployed } = useReadContract({
    address: CONTRACTS.STRATEGY_MANAGER,
    abi: STRATEGY_MANAGER_ABI,
    functionName: 'totalDeployed',
    query: { refetchInterval: 4000 }
  });

  const { data: strategy1 } = useReadContract({
    address: CONTRACTS.STRATEGY_MANAGER,
    abi: STRATEGY_MANAGER_ABI,
    functionName: 's_strategies',
    args: [BigInt(1)],
    query: { refetchInterval: 5000 }
  });

  const { data: strategy2 } = useReadContract({
    address: CONTRACTS.STRATEGY_MANAGER,
    abi: STRATEGY_MANAGER_ABI,
    functionName: 's_strategies',
    args: [BigInt(2)],
    query: { refetchInterval: 5000 }
  });

  const { data: strategy3 } = useReadContract({
    address: CONTRACTS.STRATEGY_MANAGER,
    abi: STRATEGY_MANAGER_ABI,
    functionName: 's_strategies',
    args: [BigInt(3)],
    query: { refetchInterval: 5000 }
  });

  const { data: strategy4 } = useReadContract({
    address: CONTRACTS.STRATEGY_MANAGER,
    abi: STRATEGY_MANAGER_ABI,
    functionName: 's_strategies',
    args: [BigInt(4)],
    query: { refetchInterval: 5000 }
  });

  const { data: strategy5 } = useReadContract({
    address: CONTRACTS.STRATEGY_MANAGER,
    abi: STRATEGY_MANAGER_ABI,
    functionName: 's_strategies',
    args: [BigInt(5)],
    query: { refetchInterval: 5000 }
  });

  const { data: strategy6 } = useReadContract({
    address: CONTRACTS.STRATEGY_MANAGER,
    abi: STRATEGY_MANAGER_ABI,
    functionName: 's_strategies',
    args: [BigInt(6)],
    query: { refetchInterval: 5000 }
  });

  useEffect(() => {
    if (decimals) setTokenDecimals(Number(decimals));
  }, [decimals]);

  useEffect(() => {
    if (blockNumber) setLastRefresh(Date.now());
  }, [blockNumber]);

  const { writeContractAsync: writeApprove, data: approveHash } = useWriteContract();
  const { writeContractAsync: writeDeposit, data: depositHash } = useWriteContract();
  const { writeContract: writeWithdraw, data: withdrawHash } = useWriteContract();
  const { writeContract: writeAddStrategy, data: addStrategyHash } = useWriteContract();
  const { writeContract: writeRemoveStrategy, data: removeStrategyHash } = useWriteContract();
  const { writeContract: writeSetActive, data: setActiveHash } = useWriteContract();
  const { writeContract: writeRebalance, data: rebalanceHash } = useWriteContract();

  const { isSuccess: approveSuccess, isLoading: approveLoading } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isSuccess: depositSuccess, isLoading: depositLoading } = useWaitForTransactionReceipt({ hash: depositHash });
  const { isSuccess: withdrawSuccess, isLoading: withdrawLoading } = useWaitForTransactionReceipt({ hash: withdrawHash });
  const { isSuccess: addStrategySuccess, isLoading: addStrategyLoading } = useWaitForTransactionReceipt({ hash: addStrategyHash });
  const { isSuccess: removeStrategySuccess, isLoading: removeStrategyLoading } = useWaitForTransactionReceipt({ hash: removeStrategyHash });
  const { isSuccess: setActiveSuccess, isLoading: setActiveLoading } = useWaitForTransactionReceipt({ hash: setActiveHash });
  const { isSuccess: rebalanceSuccess, isLoading: rebalanceLoading } = useWaitForTransactionReceipt({ hash: rebalanceHash });

  useEffect(() => {
    if (depositSuccess) {
      setTxStatus('Deposit successful');
      setDepositAmount('');
      setIsApproving(false);
      refetchBalance();
      refetchShares();
      refetchTotalAssets();
      refetchAllowance();
      setTimeout(() => setTxStatus(''), 5000);
    }
  }, [depositSuccess]);

  useEffect(() => {
    if (withdrawSuccess) {
      setTxStatus('Withdrawal successful');
      setWithdrawAmount('');
      refetchBalance();
      refetchShares();
      refetchTotalAssets();
      setTimeout(() => setTxStatus(''), 5000);
    }
  }, [withdrawSuccess]);

  useEffect(() => {
    if (addStrategySuccess) {
      setTxStatus('Strategy added successfully');
      setNewStrategyAddress('');
      refetchAPRs();
      setTimeout(() => setTxStatus(''), 5000);
    }
  }, [addStrategySuccess]);

  useEffect(() => {
    if (removeStrategySuccess) {
      setTxStatus('Strategy removed successfully');
      setStrategyToRemove('');
      refetchAPRs();
      refetchActiveStrategy();
      setTimeout(() => setTxStatus(''), 5000);
    }
  }, [removeStrategySuccess]);

  useEffect(() => {
    if (setActiveSuccess) {
      setTxStatus('Active strategy updated');
      setStrategyIdToSet('');
      refetchActiveId();
      refetchActiveStrategy();
      setTimeout(() => setTxStatus(''), 5000);
    }
  }, [setActiveSuccess]);

  useEffect(() => {
    if (rebalanceSuccess) {
      setTxStatus('Rebalance completed successfully');
      refetchAPRs();
      refetchActiveStrategy();
      setTimeout(() => setTxStatus(''), 5000);
    }
  }, [rebalanceSuccess]);

  const handleManualRefresh = async () => {
    setTxStatus('Refreshing data...');
    await Promise.all([
      refetchShares(),
      refetchBalance(),
      refetchTotalAssets(),
      refetchAllowance(),
      refetchAPRs(),
      refetchActiveId(),
      refetchActiveStrategy(),
    ]);
    setLastRefresh(Date.now());
    setTxStatus('Data refreshed');
    setTimeout(() => setTxStatus(''), 2000);
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const amount = parseUnits(depositAmount, tokenDecimals);
      const currentAllowance = (tokenAllowance as bigint) || BigInt(0);

      if (currentAllowance < amount) {
        setIsApproving(true);
        setTxStatus('Step 1/2: Approving token...');
        
        await writeApprove({
          address: CONTRACTS.ASSET_TOKEN,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [CONTRACTS.VAULT_CORE, amount],
        });
        
        setTxStatus('Approval sent. Click deposit again after confirmation.');
        setIsApproving(false);
        return;
      }

      setTxStatus('Depositing...');
      await writeDeposit({
        address: CONTRACTS.VAULT_CORE,
        abi: VAULT_CORE_ABI,
        functionName: 'deposit',
        args: [amount],
      });
      
      setTxStatus('Waiting for deposit confirmation...');
      
    } catch (error: any) {
      console.error('Transaction Error:', error);
      setTxStatus(`Failed: ${error.shortMessage || error.message || 'Unknown error'}`);
      setIsApproving(false);
      setTimeout(() => setTxStatus(''), 8000);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const shares = parseUnits(withdrawAmount, 18);
      setTxStatus('Initiating withdrawal...');
      writeWithdraw({
        address: CONTRACTS.VAULT_CORE,
        abi: VAULT_CORE_ABI,
        functionName: 'withdraw',
        args: [shares],
      });
    } catch (error) {
      console.error('Withdraw error:', error);
      setTxStatus('Withdrawal failed');
      setTimeout(() => setTxStatus(''), 5000);
    }
  };

  const handleWithdrawAll = () => {
    if (userShares) {
      setWithdrawAmount(formatUnits(userShares as bigint, 18));
    }
  };

  const handleAddStrategy = () => {
    if (!newStrategyAddress || !newStrategyAddress.startsWith('0x')) {
      alert('Please enter a valid strategy address');
      return;
    }

    setTxStatus('Adding strategy...');
    writeAddStrategy({
      address: CONTRACTS.STRATEGY_MANAGER,
      abi: STRATEGY_MANAGER_ABI,
      functionName: 'addStrategy',
      args: [newStrategyAddress as `0x${string}`],
    });
  };

  const handleRemoveStrategy = () => {
    if (!strategyToRemove || !strategyToRemove.startsWith('0x')) {
      alert('Please enter a valid strategy address');
      return;
    }

    setTxStatus('Removing strategy...');
    writeRemoveStrategy({
      address: CONTRACTS.STRATEGY_MANAGER,
      abi: STRATEGY_MANAGER_ABI,
      functionName: 'removeStrategy',
      args: [strategyToRemove as `0x${string}`],
    });
  };

  const handleSetActiveStrategy = () => {
    const id = parseInt(strategyIdToSet);
    if (!id || id <= 0) {
      alert('Please enter a valid strategy ID');
      return;
    }

    setTxStatus('Setting active strategy...');
    writeSetActive({
      address: CONTRACTS.STRATEGY_MANAGER,
      abi: STRATEGY_MANAGER_ABI,
      functionName: 'setActiveStrategy',
      args: [BigInt(id)],
    });
  };

  const handleRebalance = () => {
    setTxStatus('Executing rebalance...');
    writeRebalance({
      address: CONTRACTS.REBALANCER,
      abi: REBALANCER_ABI,
      functionName: 'performRebalance',
    });
  };

  const getActiveStrategies = () => {
    const strategies = [strategy1, strategy2, strategy3, strategy4, strategy5, strategy6];
    const aprs = (strategyAPRs as bigint[]) || [];
    
    const activeStrategies: { id: number; address: string; apr: bigint }[] = [];
    
    strategies.forEach((strategyAddress, index) => {
      const strategyId = index + 1;
      if (strategyAddress && strategyAddress !== '0x0000000000000000000000000000000000000000') {
        activeStrategies.push({
          id: strategyId,
          address: strategyAddress as string,
          apr: aprs[index] || BigInt(0)
        });
      }
    });
    
    return activeStrategies;
  };
  
  const formatBalance = (value: bigint | undefined, decimals: number = 18): string => {
    if (!value) return '0.00';
    const formatted = formatUnits(value, decimals);
    return parseFloat(formatted).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  };

  const calculateAPY = (): string => {
    if (!strategyAPRs || strategyAPRs.length === 0) return '0.0';
    const maxAPR = (strategyAPRs as bigint[]).reduce((max, apr) => apr > max ? apr : max, BigInt(0));
    return (Number(maxAPR) / 1e16).toFixed(1);
  };

  const calculateShareValue = (): string => {
    if (!userShares || !totalAssets || !totalShares || totalShares === BigInt(0)) return '0.00';
    const value = (userShares as bigint) * (totalAssets as bigint) / (totalShares as bigint);
    return formatBalance(value, tokenDecimals);
  };

  const needsApproval = (): boolean => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return false;
    try {
      const amount = parseUnits(depositAmount, tokenDecimals);
      const allowance = (tokenAllowance as bigint) || BigInt(0);
      return allowance < amount;
    } catch {
      return false;
    }
  };

  const isLoading = approveLoading || depositLoading || withdrawLoading || 
                    addStrategyLoading || removeStrategyLoading || setActiveLoading || rebalanceLoading || isApproving;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950 transition-colors">
      <header className="border-b border-emerald-200 dark:border-emerald-900 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-500/20 text-white">
                  K
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-emerald-200 bg-clip-text text-transparent">
                  KingYieldAggregator
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Institutional DeFi Yield Optimization</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title={isDarkMode ? 'Light mode' : 'Dark mode'}
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-amber-500" />
                ) : (
                  <Moon size={20} className="text-slate-600" />
                )}
              </button>

              {isConnected && (
                <>
                  <button
                    onClick={handleManualRefresh}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-lg transition-all"
                    title="Refresh data"
                  >
                    <RefreshCw size={16} className="text-slate-600 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Refresh</span>
                  </button>
                  
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-700 dark:text-emerald-300 font-medium">Live</span>
                  </div>
                </>
              )}
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {txStatus && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
            {isLoading ? (
              <Loader2 className="animate-spin text-emerald-600 dark:text-emerald-400" size={18} />
            ) : (
              <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={18} />
            )}
            <p className="text-sm text-slate-700 dark:text-emerald-200 font-medium">{txStatus}</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isConnected ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/50 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-1">Your Shares</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatBalance(userShares as bigint)}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Value: {calculateShareValue()} {tokenSymbol?.toString()}</p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg hover:shadow-green-100/50 dark:hover:shadow-green-900/50 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-1">Total Value Locked</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatBalance(totalAssets as bigint, tokenDecimals)}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center">
                    <Shield className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{tokenSymbol?.toString()} across all strategies</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 border border-emerald-300 dark:border-emerald-700 rounded-2xl p-6 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-emerald-50 text-sm font-semibold mb-1">Highest APY</p>
                    <p className="text-3xl font-bold text-white">{calculateAPY()}%</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                </div>
                <p className="text-xs text-emerald-50">Auto-optimized yield</p>
              </div>

              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-emerald-900/50 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold mb-1">Deployed Capital</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatBalance(totalDeployed as bigint, tokenDecimals)}</p>
                  </div>
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                    <Wallet className="text-slate-600 dark:text-slate-400" size={20} />
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">In active strategies</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab('vault')}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'vault'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Vault Operations
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Admin Controls
              </button>
            </div>

            {activeTab === 'vault' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                        <Plus className="text-emerald-600 dark:text-emerald-400" size={20} />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Deposit</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Amount ({tokenSymbol?.toString()})
                        </label>
                        <input
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-4 text-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Balance: {formatBalance(tokenBalance as bigint, tokenDecimals)}
                          </p>
                          <button
                            onClick={() => tokenBalance && setDepositAmount(formatUnits(tokenBalance as bigint, tokenDecimals))}
                            className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold"
                          >
                            Max
                          </button>
                        </div>
                      </div>

                      {depositAmount && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-1">
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            Allowance: {formatBalance(tokenAllowance as bigint, tokenDecimals)} {tokenSymbol?.toString()}
                          </p>
                          {needsApproval() && (
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              Needs approval (2-step process)
                            </p>
                          )}
                        </div>
                      )}

                      <button
                        onClick={handleDeposit}
                        disabled={isLoading || !depositAmount}
                        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-xl py-4 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            {isApproving ? 'Approving...' : 'Depositing...'}
                          </>
                        ) : needsApproval() ? (
                          'Approve & Deposit'
                        ) : (
                          'Deposit'
                        )}
                      </button>

                      <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                        <p className="text-xs text-slate-700 dark:text-emerald-200 leading-relaxed">
                          {needsApproval() 
                            ? 'This will require 2 transactions: approve then deposit.' 
                            : 'Your deposit will be allocated to the highest-yielding strategy.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                        <Minus className="text-slate-700 dark:text-slate-300" size={20} />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Withdraw</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Shares Amount
                        </label>
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-4 text-xl font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Available: {formatBalance(userShares as bigint)}
                          </p>
                          <button
                            onClick={handleWithdrawAll}
                            className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold"
                          >
                            Withdraw All
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleWithdraw}
                        disabled={isLoading || !withdrawAmount}
                        className="w-full bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 rounded-xl py-4 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                      >
                        {withdrawLoading ? 'Withdrawing...' : 'Withdraw'}
                      </button>

                      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          Withdrawals are processed instantly if vault has sufficient balance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-slate-800 dark:to-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                      <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Position Value</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">Your Shares</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formatBalance(userShares as bigint)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total shares owned</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">Share Value</p>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {calculateShareValue()} {tokenSymbol?.toString()}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Current value</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">Earning</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {calculateAPY()}% APY
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Annual yield rate</p>
                    </div>
                  </div>

                  <div className="mt-4 bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Estimated Earnings</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Based on current APY</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {userShares && totalAssets && totalShares && totalShares !== BigInt(0)
                            ? `+${(
                                (Number(userShares as bigint) * Number(totalAssets as bigint) / Number(totalShares as bigint)) * 
                                (Number(calculateAPY()) / 100) / 
                                Math.pow(10, tokenDecimals)
                              ).toFixed(2)} ${tokenSymbol?.toString()}/year`
                            : '0.00'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Projected annual</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Active Strategies</h2>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                    >
                      {showAdvanced ? 'Hide' : 'Show'} Details
                      <ChevronDown className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} size={16} />
                    </button>
                  </div>

                  {(() => {
                    const activeStrategies = getActiveStrategies();
                    return activeStrategies.length > 0 ? (
                      <div className="space-y-3">
                        {activeStrategies.map((strategy) => (
                          <div
                            key={strategy.id}
                            className={`border rounded-xl p-4 transition-all ${
                              Number(activeStrategyId) === strategy.id
                                ? 'border-emerald-300 dark:border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/50'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-slate-900 dark:text-white">Strategy #{strategy.id}</h3>
                                  {Number(activeStrategyId) === strategy.id && (
                                    <span className="px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs rounded-full font-semibold">
                                      Active
                                    </span>
                                  )}
                                </div>
                                {showAdvanced && (
                                  <>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">ID: {strategy.id}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono break-all">
                                      {strategy.address.slice(0, 10)}...{strategy.address.slice(-8)}
                                    </p>
                                  </>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                  {strategy.apr ? (Number(strategy.apr) / 1e16).toFixed(2) : '0.00'}%
                                </p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">APR</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-slate-500 dark:text-slate-400">No strategies deployed yet</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-emerald-900 dark:text-emerald-100">Admin Access Required</p>
                    <p className="text-sm text-slate-700 dark:text-emerald-200 mt-1">
                      Only the contract king and admin can execute these functions.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Strategy</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={newStrategyAddress}
                        onChange={(e) => setNewStrategyAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all"
                      />
                      <button
                        onClick={handleAddStrategy}
                        disabled={isLoading || !newStrategyAddress}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl py-3 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                      >
                        {addStrategyLoading ? 'Adding...' : 'Add Strategy'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Remove Strategy</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={strategyToRemove}
                        onChange={(e) => setStrategyToRemove(e.target.value)}
                        placeholder="0x..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-800 transition-all"
                      />
                      <button
                        onClick={handleRemoveStrategy}
                        disabled={isLoading || !strategyToRemove}
                        className="w-full bg-red-600 hover:bg-red-700 rounded-xl py-3 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                      >
                        {removeStrategyLoading ? 'Removing...' : 'Remove Strategy'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Set Active Strategy</h3>
                    <div className="space-y-4">
                      <input
                        type="number"
                        value={strategyIdToSet}
                        onChange={(e) => setStrategyIdToSet(e.target.value)}
                        placeholder="Strategy ID (1, 2, 3...)"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all"
                      />
                      <button
                        onClick={handleSetActiveStrategy}
                        disabled={isLoading || !strategyIdToSet}
                        className="w-full bg-green-600 hover:bg-green-700 rounded-xl py-3 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                      >
                        {setActiveLoading ? 'Setting...' : 'Set Active'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Rebalance</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Moves funds to highest APR strategy
                      </p>
                      <button
                        onClick={handleRebalance}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl py-3 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        {rebalanceLoading ? (
                          <>
                            <Loader2 className="animate-spin" size={18} />
                            Rebalancing...
                          </>
                        ) : (
                          <>
                            <RefreshCw size={18} />
                            Execute Rebalance
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Deployed Contracts</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">VaultCore</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 flex-1 font-mono text-slate-700 dark:text-slate-300">
                          {CONTRACTS.VAULT_CORE}
                        </code>
                        <a
                          href={`https://sepolia.basescan.org/address/${CONTRACTS.VAULT_CORE}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded border border-slate-200 dark:border-slate-600 transition-colors"
                        >
                          <ExternalLink size={16} className="text-slate-600 dark:text-slate-400" />
                        </a>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">StrategyManager</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 flex-1 font-mono text-slate-700 dark:text-slate-300">
                          {CONTRACTS.STRATEGY_MANAGER}
                        </code>
                        <a
                          href={`https://sepolia.basescan.org/address/${CONTRACTS.STRATEGY_MANAGER}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded border border-slate-200 dark:border-slate-600 transition-colors"
                        >
                          <ExternalLink size={16} className="text-slate-600 dark:text-slate-400" />
                        </a>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">Rebalancer</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 flex-1 font-mono text-slate-700 dark:text-slate-300">
                          {CONTRACTS.REBALANCER}
                        </code>
                        <a
                          href={`https://sepolia.basescan.org/address/${CONTRACTS.REBALANCER}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded border border-slate-200 dark:border-slate-600 transition-colors"
                        >
                          <ExternalLink size={16} className="text-slate-600 dark:text-slate-400" />
                        </a>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">Asset Token ({tokenSymbol?.toString()})</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded px-3 py-2 flex-1 font-mono text-slate-700 dark:text-slate-300">
                          {CONTRACTS.ASSET_TOKEN}
                        </code>
                        <a
                          href={`https://sepolia.basescan.org/address/${CONTRACTS.ASSET_TOKEN}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded border border-slate-200 dark:border-slate-600 transition-colors"
                        >
                          <ExternalLink size={16} className="text-slate-600 dark:text-slate-400" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl mb-6">
              <Wallet className="text-emerald-600 dark:text-emerald-400" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Connect Your Wallet</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Connect your wallet to access institutional-grade yield optimization
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 mt-16 py-8 text-center bg-white/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Built by BuildsWithKing | Deployed on Base Sepolia
          </p>
        </div>
      </footer>
    </div>
  );
}