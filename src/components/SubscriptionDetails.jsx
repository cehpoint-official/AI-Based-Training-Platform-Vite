// import React from 'react';

// const SubscriptionDetails = ({ jsonData, plan, method }) => {

//     const {
//         id,
//         start_time,
//         billing_info,
//     } = jsonData;

//     sessionStorage.setItem('subscriberId', id);
//     sessionStorage.setItem('billing', billing_info.next_billing_time);

//     return (
//         <div className='text-center py-10 flex items-center justify-center max-w-lg flex-col'>
//             <p className='text-black dark:text-white font-normal'><strong>Payment Method:</strong> {method.toUpperCase()}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Plan:</strong> {plan}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Subscription ID:</strong> {id}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Start Time:</strong> {start_time}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Next Billing Time:</strong> {billing_info.next_billing_time}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Amount:</strong> {billing_info.last_payment.amount.value} {billing_info.last_payment.amount.currency_code}</p>
//         </div>
//     );
// };

// export default SubscriptionDetails;