// import React from 'react';

// const ReceiptDisplay = ({ jsonData }) => {

//     const {
//         id,
//         start_time,
//         billing_info,
//     } = jsonData;

//     return (
//         <div className='text-center py-10 flex items-center justify-center max-w-lg flex-col'>
//             <h2 className='text-black dark:text-white font-black text-2xl my-3'>Receipt Information</h2>
//             <p className='text-black dark:text-white font-normal'><strong>Subscription ID:</strong> {id}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Start Time:</strong> {start_time}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Next Billing Time:</strong> {billing_info.next_billing_time}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Amount:</strong> {billing_info.last_payment.amount.value} {billing_info.last_payment.amount.currency_code}</p>
//         </div>
//     );
// };

// export default ReceiptDisplay;
