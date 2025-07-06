"use client"

import { toast } from '@/lib/toast-service'

export function ToastDemo() {
  const handleTestToasts = () => {
    // Show all different types - clean 1-liner design
    toast.success('Monster fusion completed')
    
    setTimeout(() => {
      toast.error('Failed to connect wallet')
    }, 300)
    
    setTimeout(() => {
      toast.warning('Low MON balance detected')
    }, 600)
    
    
    setTimeout(() => {
      const loadingId = toast.loading('Processing transaction')
      
      // Update after 3 seconds
      setTimeout(() => {
        toast.update(loadingId, 'Transaction confirmed', 'success')
      }, 3000)
    }, 1200)
  }

  const handleTransactionToast = () => {
    const txHash = '0x509c8a1b000c34fdad1767b493026585f12036c9e7b1a15651c89ae0531e2554'
    const id = toast.transaction('Fusion', txHash, 'pending')
    
    // Simulate status changes
    setTimeout(() => {
      toast.updateTransaction(id, 'Fusion', txHash, 'success')
    }, 3000)
  }

  const handleRejectedTransaction = () => {
    const txHash = '0x509c8a1b000c34fdad1767b493026585f12036c9e7b1a15651c89ae0531e2554'
    const id = toast.transaction('Fusion', txHash, 'pending')
    
    // Simulate rejection
    setTimeout(() => {
      toast.updateTransaction(id, 'Fusion', txHash, 'error')
    }, 2000)
  }

  const handleMultipleTransactions = () => {
    const hashes = [
      '0x509c8a1b000c34fdad1767b493026585f12036c9e7b1a15651c89ae0531e2554',
      '0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456',
      '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    ]
    
    // Show multiple pending transactions
    hashes.forEach((hash, i) => {
      setTimeout(() => {
        const id = toast.transaction(`TX ${i + 1}`, hash, 'pending')
        
        // Random outcomes
        setTimeout(() => {
          const isSuccess = Math.random() > 0.5
          toast.updateTransaction(id, `TX ${i + 1}`, hash, isSuccess ? 'success' : 'error')
        }, 2000 + (i * 1000))
      }, i * 300)
    })
  }

  const handleMultipleToasts = () => {
    toast.info('Testing clean 1-liner design')
    setTimeout(() => toast.success('Unified background with soft borders'), 200)
    setTimeout(() => toast.warning('No more emojis or bulky text'), 400)
    setTimeout(() => toast.error('Status indicated by border color'), 600)
    setTimeout(() => toast.loading('Compact and readable'), 800)
  }

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-lg font-semibold text-white mb-4">Toast System Demo</h3>
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={handleTestToasts}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          All Types
        </button>
        <button 
          onClick={handleTransactionToast}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          TX Success
        </button>
        <button 
          onClick={handleRejectedTransaction}
          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          TX Reject
        </button>
        <button 
          onClick={handleMultipleTransactions}
          className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
        >
          Multi TX
        </button>
        <button 
          onClick={handleMultipleToasts}
          className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
        >
          Stack 5
        </button>
        <button 
          onClick={() => toast.dismiss()}
          className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
        >
          Clear All
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        <p><strong>Compact Transaction Design:</strong></p>
        <ul className="text-xs mt-1 space-y-1">
          <li>• Shows 5 toasts before stacking</li>
          <li>• TX format: [◐ animated] [message] [hash] [🔗 clickable]</li>
          <li>• Status colors: blue pending, green success, red error</li>
          <li>• Slides from left, exits to left</li>
          <li>• Glass design with thick colorful borders</li>
        </ul>
        <code className="block mt-2 p-2 bg-gray-800 rounded text-xs">
          {`import { toast } from '@/lib/toast-service'

// Regular toasts
toast.success('Monster evolved')
toast.error('Transaction failed')

// Compact TX format
const id = toast.transaction('Fusion', txHash, 'pending')
toast.updateTransaction(id, 'Fusion', txHash, 'success')`}
        </code>
      </div>
    </div>
  )
}