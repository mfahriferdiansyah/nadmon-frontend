"use client"

import React from 'react'
import { toast as sonnerToast } from 'sonner'

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface ToastOptions {
  duration?: number
  dismissible?: boolean
  icon?: React.ReactNode
}

class ToastService {
  private static instance: ToastService
  
  private constructor() {}
  
  public static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService()
    }
    return ToastService.instance
  }

  // Main toast method with unified background and soft border colors
  public show(message: string, type: ToastType = 'info', options: ToastOptions = {}) {
    const { duration = 4000, dismissible = true } = options

    const baseStyle = {
      background: 'rgba(15, 23, 42, 0.9)',
      color: 'white',
      backdropFilter: 'blur(12px)',
      fontSize: '13px',
      padding: '10px 14px',
      minHeight: '40px',
      borderRadius: '8px',
      maxWidth: '380px',
      lineHeight: '1.2',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }

    const getTypeClassName = (type: ToastType) => {
      return `toast-slide-top toast-${type}`
    }

    switch (type) {
      case 'success':
        return sonnerToast.success(message, {
          duration,
          dismissible,
          className: getTypeClassName('success'),
          style: {
            ...baseStyle,
            border: '2px solid rgba(34, 197, 94, 0.8)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(34, 197, 94, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05) inset',
          },
        })
      
      case 'error':
        return sonnerToast.error(message, {
          duration: duration === 4000 ? 6000 : duration, // Errors stay longer by default
          dismissible,
          className: getTypeClassName('error'),
          style: {
            ...baseStyle,
            border: '2px solid rgba(239, 68, 68, 0.8)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05) inset',
          },
        })
      
      case 'warning':
        return sonnerToast.warning(message, {
          duration,
          dismissible,
          className: getTypeClassName('warning'),
          style: {
            ...baseStyle,
            border: '2px solid rgba(245, 158, 11, 0.8)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05) inset',
          },
        })
      
      case 'loading':
        return sonnerToast.loading(message, {
          duration: 0, // Loading toasts don't auto-dismiss
          dismissible,
          className: getTypeClassName('loading'),
          style: {
            ...baseStyle,
            border: '2px solid rgba(59, 130, 246, 0.8)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05) inset',
          },
        })
      
      default: // info
        return sonnerToast(message, {
          duration,
          dismissible,
          className: getTypeClassName('info'),
          style: {
            ...baseStyle,
            border: '2px solid rgba(100, 116, 139, 0.8)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(100, 116, 139, 0.05), 0 1px 0 rgba(255, 255, 255, 0.05) inset',
          },
        })
    }
  }

  // Convenience methods
  public success(message: string, options?: ToastOptions) {
    return this.show(message, 'success', options)
  }

  public error(message: string, options?: ToastOptions) {
    return this.show(message, 'error', options)
  }

  public warning(message: string, options?: ToastOptions) {
    return this.show(message, 'warning', options)
  }

  public info(message: string, options?: ToastOptions) {
    return this.show(message, 'info', options)
  }

  public loading(message: string, options?: ToastOptions) {
    return this.show(message, 'loading', options)
  }

  // Dismiss all toasts
  public dismissAll() {
    sonnerToast.dismiss()
  }

  // Dismiss specific toast by id
  public dismiss(id: string | number) {
    sonnerToast.dismiss(id)
  }

  // Transaction method with custom layout: [status icon] [text] [hash] [link button]
  public transaction(message: string, txHash?: string, status: 'pending' | 'success' | 'error' = 'pending') {
    if (!txHash) {
      return this.loading(message, { duration: 0 })
    }

    const shortHash = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`
    const explorerUrl = `https://testnet.monvision.io/tx/${txHash}`
    
    // Get status icon - no custom icon for pending, let Sonner handle it
    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'pending': return null // Let Sonner's loading icon handle this
        case 'success': return '✓'
        case 'error': return '✗'
        default: return null
      }
    }
    
    // Use loading type for pending to get the correct spinner icon
    const toastType = status === 'pending' ? 'loading' : status === 'success' ? 'success' : 'error'
    
    // Create custom JSX content
    const customContent = (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getStatusIcon(status) && <span style={{ fontSize: '14px' }}>{getStatusIcon(status)}</span>}
          <span>{message}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            fontSize: '12px', 
            opacity: 0.8,
            fontFamily: 'monospace'
          }}>{shortHash}</span>
          <button
            onClick={() => window.open(explorerUrl, '_blank')}
            style={{
              background: 'rgba(71, 85, 105, 0.6)',
              border: '1px solid rgba(71, 85, 105, 0.8)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(71, 85, 105, 0.8)'
              e.target.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(71, 85, 105, 0.6)'
              e.target.style.transform = 'scale(1)'
            }}
          >
            View
          </button>
        </div>
      </div>
    )
    
    // Use sonner directly with custom content
    const toastOptions = {
      duration: status === 'pending' ? 0 : 4000,
      dismissible: true,
      className: this.getTypeClassName(toastType),
      style: {
        background: 'rgba(15, 23, 42, 0.9)',
        color: 'white',
        backdropFilter: 'blur(12px)',
        fontSize: '13px',
        padding: '10px 14px',
        minHeight: '40px',
        borderRadius: '8px',
        maxWidth: '420px',
        lineHeight: '1.2',
        fontWeight: '500',
        border: this.getBorderForType(toastType),
        boxShadow: this.getBoxShadowForType(toastType),
      }
    }

    if (toastType === 'loading') {
      return sonnerToast.loading(customContent, toastOptions)
    } else if (toastType === 'success') {
      return sonnerToast.success(customContent, toastOptions)
    } else {
      return sonnerToast.error(customContent, toastOptions)
    }
  }

  private getTypeClassName(type: ToastType) {
    return `toast-slide-top toast-${type}`
  }

  private getBorderForType(type: ToastType) {
    switch (type) {
      case 'success': return '2px solid rgba(34, 197, 94, 0.8)'
      case 'error': return '2px solid rgba(239, 68, 68, 0.8)'
      case 'warning': return '2px solid rgba(245, 158, 11, 0.8)'
      case 'loading': return '2px solid rgba(59, 130, 246, 0.8)'
      default: return '2px solid rgba(100, 116, 139, 0.8)'
    }
  }

  private getBoxShadowForType(type: ToastType) {
    switch (type) {
      case 'success': return '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(34, 197, 94, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05) inset'
      case 'error': return '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05) inset'
      case 'warning': return '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05) inset'
      case 'loading': return '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05) inset'
      default: return '0 4px 16px rgba(0, 0, 0, 0.5), 0 0 20px rgba(100, 116, 139, 0.05), 0 1px 0 rgba(255, 255, 255, 0.05) inset'
    }
  }

  // Update loading toast to success/error
  public updateToast(id: string | number, message: string, type: ToastType) {
    this.dismiss(id)
    this.show(message, type)
  }

  // Update transaction status without removing toast
  public updateTransaction(id: string | number, message: string, txHash: string, status: 'pending' | 'success' | 'error') {
    this.dismiss(id)
    return this.transaction(message, txHash, status)
  }
}

// Export singleton instance
export const toastService = ToastService.getInstance()

// Export convenient methods for direct usage
export const toast = {
  success: (message: string, options?: ToastOptions) => toastService.success(message, options),
  error: (message: string, options?: ToastOptions) => toastService.error(message, options),
  warning: (message: string, options?: ToastOptions) => toastService.warning(message, options),
  info: (message: string, options?: ToastOptions) => toastService.info(message, options),
  loading: (message: string, options?: ToastOptions) => toastService.loading(message, options),
  transaction: (message: string, txHash?: string, status?: 'pending' | 'success' | 'error') => toastService.transaction(message, txHash, status),
  dismiss: (id?: string | number) => id ? toastService.dismiss(id) : toastService.dismissAll(),
  update: (id: string | number, message: string, type: ToastType) => toastService.updateToast(id, message, type),
  updateTransaction: (id: string | number, message: string, txHash: string, status: 'pending' | 'success' | 'error') => toastService.updateTransaction(id, message, txHash, status),
}