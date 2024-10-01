// import React from 'react';
// import { MonthCost, MonthType, YearCost } from '../constants';

// const SubscriptionDetailsPayStack = ({ jsonData, plan, method }) => {

//     let amount = '';
//     if (sessionStorage.getItem('type') === MonthType) {
//         amount = MonthCost
//     } else {
//         amount = YearCost
//     }

//     return (
//         <div className='text-center py-10 flex items-center justify-center max-w-lg flex-col'>
//             <p className='text-black dark:text-white font-normal'><strong>Payment Method:</strong> {method.toUpperCase()}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Plan:</strong> {plan}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Subscription ID:</strong> {jsonData.subscription_code}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Customer ID:</strong> {jsonData.customer_code}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Started:</strong> {jsonData.createdAt}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Amount:</strong> {amount} USD</p>
//         </div>
//     );
// };

// export default SubscriptionDetailsPayStack;