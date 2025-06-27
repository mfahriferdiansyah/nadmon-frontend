"use client"

import type React from "react"
import { Hammer, X } from "lucide-react"

interface UnderDevelopmentOverlayProps {
  onClose: () => void
}

export function UnderDevelopmentOverlay({ onClose }: UnderDevelopmentOverlayProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Blur Backdrop - Higher than battleground popup */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" />
      
      {/* Under Development Notice */}
      <div className="relative z-10 glass-dev-panel rounded-2xl p-8 max-w-md w-full text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="dev-icon-container mb-4">
          <Hammer className="w-16 h-16 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-6">Under Development</h2>

        {/* Description */}
        <p className="text-white/70 mb-6 leading-relaxed">
          The Battle Arena is currently under development. We're working hard to bring you an amazing battle experience!
        </p>

        {/* Status Badge */}
        <div className="dev-status-badge">
          <span className="text-sm font-semibold">Coming Soon</span>
        </div>
      </div>

      <style jsx>{`
        .glass-dev-panel {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .dev-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 96px;
          height: 96px;
          margin: 0 auto;
          border-radius: 50%;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background: rgba(131, 110, 249, 0.2);
          border: 2px solid rgba(131, 110, 249, 0.3);
          box-shadow: 0 4px 16px rgba(131, 110, 249, 0.3);
        }

        .dev-status-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 50px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background: rgba(131, 110, 249, 0.3);
          border: 1px solid rgba(131, 110, 249, 0.4);
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  )
} 