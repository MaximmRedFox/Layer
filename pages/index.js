import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import Head from 'next/head';
import { Connection, PublicKey } from '@solana/web3.js';

export default function GovernancePage() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();

  const [status, setStatus] = useState({ message: '', type: '', active: false });
  const [nftCount, setNftCount] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCounts, setVoteCounts] = useState({
    '0.0404': 0,
    '0.101': 0,
    '0.202': 0,
  });
  const [showVoting, setShowVoting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [checking, setChecking] = useState(false);

  const wallet = wallets.length > 0 ? wallets[0] : null;
  const walletAddress = wallet?.address;

  // Show status message
  const showStatus = (message, type = 'success') => {
    setStatus({ message, type, active: true });
    setTimeout(() => setStatus({ message: '', type: '', active: false }), 5000);
  };

  // Check NFT ownership when wallet connects
  useEffect(() => {
    if (walletAddress && authenticated) {
      checkNFTOwnership();
    }
  }, [walletAddress, authenticated]);

  // Check NFT ownership
  const checkNFTOwnership = async () => {
    if (checking) return;
    setChecking(true);

    try {
      showStatus('Checking NFT ownership...', 'success');

      // TODO: Replace with real on-chain check when collection exists
      // const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC);
      // const publicKey = new PublicKey(walletAddress);
      // const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      //   programId: TOKEN_PROGRAM_ID
      // });
      // Filter for TheStrainLab collection

      // Mock for now
      setTimeout(() => {
        const mockCount = Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;
        setNftCount(mockCount);
        setChecking(false);

        if (mockCount > 0) {
          showStatus(`Access granted! You own ${mockCount} NFT${mockCount > 1 ? 's' : ''}.`, 'success');
          setShowVoting(true);
        } else {
          showStatus('No TheStrainLab NFTs found. You need at least 1 NFT to vote.', 'error');
        }
      }, 2000);
    } catch (error) {
      console.error('NFT check error:', error);
      showStatus('Error checking NFT ownership', 'error');
      setChecking(false);
    }
  };

  // Submit vote
  const submitVote = async () => {
    if (!selectedPrice || hasVoted || !walletAddress) return;

    try {
      showStatus('Submitting vote...', 'success');

      // TODO: Replace with real API call
      const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT + '/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          twitterUsername: user?.twitter?.username,
          selectedPrice,
          nftCount,
        }),
      }).catch(() => ({ ok: true })); // Mock success for demo

      if (response.ok) {
        setHasVoted(true);
        setVoteCounts((prev) => ({
          ...prev,
          [selectedPrice]: prev[selectedPrice] + 1,
        }));
        showStatus('Vote submitted successfully!', 'success');
        setShowVoting(false);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Vote error:', error);
      showStatus('Error submitting vote. Please try again.', 'error');
    }
  };

  // Calculate percentages
  const total = voteCounts['0.0404'] + voteCounts['0.101'] + voteCounts['0.202'];
  const percentages = {
    '0.0404': total > 0 ? Math.round((voteCounts['0.0404'] / total) * 100) : 0,
    '0.101': total > 0 ? Math.round((voteCounts['0.101'] / total) * 100) : 0,
    '0.202': total > 0 ? Math.round((voteCounts['0.202'] / total) * 100) : 0,
  };

  const voteOptions = [
    {
      price: '0.0404',
      usd: '~$8',
      details: [
        'Ultra-accessible entry point',
        'Maximum community participation',
        'Democratic barrier to entry',
        '(404 error reference - if you know, you know 👀)',
      ],
    },
    {
      price: '0.101',
      usd: '~$20',
      details: [
        'Moderate commitment level',
        'Balanced accessibility & conviction',
        'Sustainable economics foundation',
        'Standard NFT entry pricing',
      ],
    },
    {
      price: '0.202',
      usd: '~$40',
      details: [
        'Premium conviction signal',
        'Higher barrier = stronger community',
        'Increased treasury reserves',
        'Long-term sustainability focus',
      ],
    },
  ];

  if (!ready) {
    return (
      <div className="min-h-screen bg-black text-green-500 flex items-center justify-center">
        <div className="text-2xl font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>ACCESS | TheStrainLab Governance</title>
        <meta name="description" content="Community governance portal for TheStrainLab. Vote on mint price with 1 NFT = 1 vote." />
      </Head>

      <div className="min-h-screen bg-black text-green-500 font-mono">
        {/* Back Button */}
        <a
          href="https://thestrainlab.com"
          className="fixed top-5 left-5 px-6 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-all font-bold z-50"
        >
          ← BACK TO SITE
        </a>

        <div className="container mx-auto px-5 py-10 max-w-5xl">
          {/* Header */}
          <div className="border-b-2 border-green-500 pb-8 mb-10 mt-16">
            <h1 className="text-4xl font-bold mb-3" style={{ textShadow: '0 0 10px #00ff00' }}>
              🧬 THESTRAINLAB GOVERNANCE
            </h1>
            <p className="text-sm text-green-600">Community Vote Portal | 1 NFT = 1 Vote</p>
          </div>

          {/* Status Message */}
          {status.active && (
            <div
              className={`mb-6 p-4 border text-center ${
                status.type === 'error'
                  ? 'bg-red-900/10 border-red-500 text-red-500'
                  : 'bg-green-900/10 border-green-500 text-green-500'
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Not Authenticated */}
          {!authenticated && (
            <div className="bg-green-900/5 border-2 border-green-500 p-10 text-center">
              <h2 className="text-2xl mb-5" style={{ textShadow: '0 0 8px #00ff00' }}>
                ACCESS REQUIRED
              </h2>
              <p className="text-sm text-green-600 mb-8 leading-relaxed">
                Connect with Twitter/X and your Solana wallet to participate in governance.
                <br />
                Only TheStrainLab NFT holders can vote.
                <br />
                <strong>1 NFT = 1 Vote</strong>
              </p>
              <button
                onClick={login}
                className="px-10 py-4 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all font-bold uppercase tracking-wider"
              >
                CONNECT WITH TWITTER/X
              </button>
            </div>
          )}

          {/* Authenticated - Waiting for Wallet */}
          {authenticated && !showVoting && !showResults && (
            <div className="bg-green-900/5 border-2 border-green-500 p-10">
              <h2 className="text-2xl mb-5 text-center" style={{ textShadow: '0 0 8px #00ff00' }}>
                CONNECTED
              </h2>

              <div className="bg-green-900/10 border border-green-500 p-5 mb-5">
                <div className="text-xs text-green-600 mb-1">Twitter/X Account:</div>
                <div className="text-sm break-all">
                  {user?.twitter?.username ? `@${user.twitter.username}` : 'Not connected'}
                </div>
              </div>

              <div className="bg-green-900/10 border border-green-500 p-5 mb-5">
                <div className="text-xs text-green-600 mb-1">Wallet Address:</div>
                <div className="text-sm break-all mb-4">{walletAddress || 'Not connected'}</div>
                <div className="flex gap-3 justify-center flex-wrap">
                  {!walletAddress && (
                    <button
                      onClick={() => showStatus('Please use Privy popup to connect wallet', 'success')}
                      className="px-6 py-3 border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition-all font-bold"
                    >
                      CONNECT WALLET
                    </button>
                  )}
                  {walletAddress && (
                    <button
                      onClick={logout}
                      className="px-6 py-3 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-all font-bold"
                    >
                      DISCONNECT
                    </button>
                  )}
                </div>
              </div>

              {nftCount > 0 && (
                <div className="bg-green-900/10 border border-green-500 p-5">
                  <div className="text-xs text-green-600 mb-1">NFTs Owned:</div>
                  <div className="text-sm">
                    {nftCount} NFT{nftCount > 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Voting Section */}
          {showVoting && (
            <div>
              <div className="bg-green-900/5 border-2 border-green-500 p-10 text-center mb-8">
                <h2 className="text-3xl mb-4" style={{ textShadow: '0 0 10px #00ff00' }}>
                  MINT PRICE GOVERNANCE VOTE
                </h2>
                <div className="text-sm text-green-600 leading-relaxed">
                  TheStrainLab Phase 1: <strong>165 NFTs</strong> | <strong>Max 1 per wallet</strong>
                  <br />
                  <br />
                  Most projects tell you the price.
                  <br />
                  We're asking.
                  <br />
                  <br />
                  <strong>Vote closes in 48 hours.</strong>
                  <br />
                  Whatever wins, we execute.
                  <br />
                  <br />
                  This is your organism.
                </div>
              </div>

              <div className="space-y-5 mb-10">
                {voteOptions.map((option) => (
                  <div
                    key={option.price}
                    onClick={() => setSelectedPrice(option.price)}
                    className={`bg-green-900/5 border-2 p-8 cursor-pointer transition-all relative ${
                      selectedPrice === option.price
                        ? 'border-green-500 bg-green-900/15 shadow-[0_0_30px_rgba(0,255,0,0.5)]'
                        : 'border-green-500 hover:bg-green-900/10 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]'
                    }`}
                  >
                    {selectedPrice === option.price && (
                      <div className="absolute top-4 right-4 text-2xl">✓</div>
                    )}
                    <div className="text-4xl font-bold mb-2" style={{ textShadow: '0 0 8px #00ff00' }}>
                      {option.price} SOL
                    </div>
                    <div className="text-lg text-green-600 mb-4">{option.usd} USD</div>
                    <div className="text-sm text-green-600 leading-relaxed">
                      {option.details.map((detail, i) => (
                        <div key={i}>{detail}</div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-5 pt-5 border-t border-green-500 text-xs">
                      <span>Current Votes:</span>
                      <span>{voteCounts[option.price]}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button
                  onClick={submitVote}
                  disabled={!selectedPrice}
                  className="px-12 py-4 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedPrice ? `SUBMIT VOTE FOR ${selectedPrice} SOL` : 'SELECT OPTION TO VOTE'}
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          {showResults && (
            <div>
              <div className="bg-green-900/10 border-2 border-green-500 p-10 text-center mb-8">
                <h2 className="text-2xl mb-4 text-green-500">VOTE SUBMITTED SUCCESSFULLY 🧬</h2>
                <div className="text-sm text-green-600 leading-relaxed">
                  Your voice has been recorded.
                  <br />
                  Results are visible in real-time below.
                  <br />
                  Poll closes in <strong>48 hours</strong>.
                </div>
              </div>

              <div className="space-y-6">
                {voteOptions.map((option) => (
                  <div key={option.price} className="bg-green-900/5 border border-green-500 p-6">
                    <div className="flex justify-between mb-3 text-sm">
                      <span>
                        {option.price} SOL ({option.usd})
                      </span>
                      <span>{percentages[option.price]}%</span>
                    </div>
                    <div className="h-8 bg-green-900/10 border border-green-500 relative overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000 flex items-center justify-end pr-3 text-xs text-black font-bold"
                        style={{ width: `${percentages[option.price]}%` }}
                      >
                        {voteCounts[option.price]} vote{voteCounts[option.price] !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t-2 border-green-500 pt-8 mt-16 text-center text-xs text-green-600">
            <p>TheStrainLab © 2025 | Against Mission Obvious</p>
          </div>
        </div>
      </div>
    </>
  );
}
