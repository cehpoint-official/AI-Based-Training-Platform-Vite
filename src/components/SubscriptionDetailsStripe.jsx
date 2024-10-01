// import React from 'react';
// import { MonthCost, MonthType, YearCost } from '../constants';

// const SubscriptionDetailsStripe = ({ jsonData, plan, method }) => {

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
//             <p className='text-black dark:text-white font-normal'><strong>Subscription ID:</strong> {jsonData.id}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Customer ID:</strong> {jsonData.customer}</p>
//             <p className='text-black dark:text-white font-normal'><strong>Amount:</strong> {amount} USD</p>
//         </div>
//     );
// };

// export default SubscriptionDetailsStripe;