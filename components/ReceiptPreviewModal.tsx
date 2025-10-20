import React, { useRef } from 'react';
import { Order, RestaurantSettings } from '../types';
import { formatCurrency } from '../utils/helpers';
import { XMarkIcon, PrinterIcon } from './icons';

interface ReceiptPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order;
    settings: RestaurantSettings;
}

const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({ isOpen, onClose, order, settings }) => {
    const receiptRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const receiptContainer = document.getElementById('receipt-container');
        if (receiptRef.current && receiptContainer) {
            receiptContainer.innerHTML = receiptRef.current.innerHTML;
            window.print();
            receiptContainer.innerHTML = ''; // Clean up
        }
    };
    
    if (!isOpen) return null;

    const renderReceiptContent = () => (
        <div className="bg-white text-black font-mono p-4 w-full text-xs">
            <div className="text-center">
                {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="mx-auto h-16 mb-2" style={{filter: 'grayscale(100%) invert(100%)'}} />}
                <h1 className="text-lg font-bold">{settings.name}</h1>
                <p>{settings.address}</p>
                <p>{settings.phone}</p>
            </div>
            <hr className="my-2 border-dashed border-black" />
            <div className="flex justify-between">
                <span>Fecha: {new Date(order.closedAt || order.createdAt).toLocaleDateString()}</span>
                <span>Hora: {new Date(order.closedAt || order.createdAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
                <span>Mesa: {order.tableNumber}</span>
                <span>Camarero: {order.waiterName}</span>
            </div>
             <div className="flex justify-between">
                <span>Pedido Nº: {order.orderNumber}</span>
            </div>
            <hr className="my-2 border-dashed border-black" />
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="text-left">CANT</th>
                        <th className="text-left">DESCRIPCIÓN</th>
                        <th className="text-right">IMPORTE</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        // Fix: Used 'item.id' for the key as 'uniqueId' does not exist on the OrderItem type.
                        <tr key={item.id}>
                            <td>{item.quantity}x</td>
                            <td>{item.name}</td>
                            <td className="text-right">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr className="my-2 border-dashed border-black" />
            <div className="space-y-1">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>IVA (21%):</span>
                    <span className="font-bold">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span className="font-bold">TOTAL:</span>
                    <span className="font-bold">{formatCurrency(order.total)}</span>
                </div>
            </div>
            
            {order.splitPayments && order.splitPayments.length > 0 && (
                 <>
                    <hr className="my-2 border-dashed border-black" />
                    <div className="space-y-1">
                        <p className="font-bold text-center">Detalle de Pago</p>
                        {order.splitPayments.map((p, i) => (
                             <div key={i} className="flex justify-between">
                                <span>{p.method === 'cash' ? 'Efectivo' : 'Tarjeta'}:</span>
                                <span>{formatCurrency(p.amount)}</span>
                             </div>
                        ))}
                    </div>
                </>
            )}
            
            <hr className="my-2 border-dashed border-black" />
            <div className="text-center">
                <p>{settings.footer}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Vista Previa del Recibo</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><XMarkIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-4 overflow-y-auto" style={{maxWidth: '320px', margin: '0 auto'}}>
                   <div ref={receiptRef}>
                     {renderReceiptContent()}
                   </div>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handlePrint} className="w-full py-3 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg hover:bg-blue-700">
                        <PrinterIcon className="h-6 w-6 mr-2"/> Imprimir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPreviewModal;