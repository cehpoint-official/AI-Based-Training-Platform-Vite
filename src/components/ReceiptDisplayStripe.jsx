// import React from 'react';
// import { MonthCost, MonthType, YearCost } from '../constants';

// const ReceiptDisplayStripe = ({ jsonData }) => {
//     let amount = '';
//     if (sessionStorage.getItem('type') === MonthType) {
//         amount = MonthCost
//     } else {
//         amount = YearCost
//     }
//     return (
//         <div className='text-center py-10 flex items-center justify-center max-w-lg flex-col'>
//             <h2 className='text-black dark:text-white font-black text-2xl my-3'>Receipt Information</h2>
//             <p className='text-black dark:text-white font-normal'><strong>Subscription ID:</strong> {jsonData.subscription}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Customer ID:</strong> {jsonData.customer}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Payment Status:</strong> {jsonData.status}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Amount:</strong> {amount} USD</p>
//         </div>
//     );
// };

// export default ReceiptDisplayStripe;
