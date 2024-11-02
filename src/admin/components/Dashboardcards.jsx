import { Card, Spinner } from 'flowbite-react';
import React from 'react';
import { FaUsers } from "react-icons/fa";
import { PiVideoFill } from "react-icons/pi";
// import { FaDollarSign } from "react-icons/fa";
// import { RiRepeat2Fill } from "react-icons/ri";
import DonutChart from 'react-donut-chart';

const DashboardCards = ({ datas, loading }) => {
    if (loading) {
        return (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" color='gray' />
          </div>
        );
      }

    const style = {
        "root": {
            "base": "w-1/5 max-lg:w-1/4 max-sm:w-2/4 flex rounded-none border border-black bg-white shadow-none dark:border-white dark:bg-black m-4",
            "children": "flex h-full flex-col justify-center gap-3 p-5",
            "horizontal": {
                "off": "flex-col",
                "on": "flex-col md:max-w-xl md:flex-row"
            },
            "href": "hover:bg-white dark:hover:bg-black"
        },
        "img": {
            "base": "",
            "horizontal": {
                "off": "rounded-none",
                "on": "h-96 w-full rounded-none object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
            }

        }
    }

    return (
        <div className='flex flex-col'>
            <div className='my-4 flex flex-wrap items-center justify-center'>
                <Card key={1} theme={style}>
                    <h5 className='text-sm max-lg:text-xs font-normal tracking-tight text-black dark:text-white'>
                        Users
                    </h5>
                    <div className='flex flex-row items-center'>
                        <FaUsers className='text-3xl max-lg:text-xl' />
                        <p className='font-black max-lg:text-xl text-2xl pl-3 text-black dark:text-white'>{datas.users}</p>
                    </div>
                </Card>
                <Card key={2} theme={style}>
                    <h5 className='text-sm max-lg:text-xs font-normal tracking-tight text-black dark:text-white'>
                        Courses
                    </h5>
                    <div className='flex flex-row items-center'>
                        <PiVideoFill className='text-3xl max-lg:text-xl' />
                        <p className='font-black max-lg:text-xl text-2xl pl-3 text-black dark:text-white'>{datas.courses}</p>
                    </div>
                </Card>
                {/* <Card key={3} theme={style}>
                    <h5 className='text-sm max-lg:text-xs font-normal tracking-tight text-black dark:text-white'>
                        Recurring Revenue
                    </h5>
                    <div className='flex flex-row items-center'>
                        <RiRepeat2Fill className='text-3xl max-lg:text-xl max-sm:text-sm' />
                        <p className='font-black max-lg:text-xl text-2xl pl-3 text-black dark:text-white'>${datas.sum}</p>
                    </div>
                </Card> */}
                {/* <Card key={4} theme={style}>
                    <h5 className='text-sm max-lg:text-xs font-normal tracking-tight text-black dark:text-white'>
                        Total Revenue
                    </h5> */}
                    {/* <div className='flex flex-row items-center'>
                        <FaDollarSign className='text-3xl max-lg:text-xl max-sm:text-sm' />
                        <p className='font-black max-lg:text-xl text-2xl pl-3 text-black dark:text-white'>${datas.total}</p>
                    </div> */}
                {/* </Card> */}
            </div>
            <div className='mt-1 flex flex-row  max-lg:flex-col items-center justify-center'>
                <div className='flex flex-col flex-1 items-center justify-center'>
                    <h1 className='mb-5 text-xl font-black'>Users</h1>
                    <DonutChart
                        className='max-md:hidden'
                        width={400}
                        height={300}
                        interactive={false}
                        onClick={false}
                        colors={['#000', '#fff']}
                        strokeColor='#000'
                        data={[
                            {
                                label: 'Paid',
                                value: datas.paids,
                            },
                            {
                                label: 'Free',
                                value: datas.frees,
                            },
                        ]}
                    />
                    <DonutChart
                        className='md:hidden'
                        width={350}
                        height={300}
                        interactive={false}
                        onClick={false}
                        colors={['#000', '#fff']}
                        strokeColor='#000'
                        data={[
                            {
                                label: 'Paid',
                                value: datas.paids,
                            },
                            {
                                label: 'Free',
                                value: datas.frees,
                            },
                        ]}
                    />
                </div>

                <div className='flex flex-1 flex-col items-center justify-center'>
                    <h1 className='mb-5 text-xl font-black'>Courses</h1>
                    <DonutChart
                        className='max-md:hidden'
                        width={400}
                        height={300}
                        interactive={false}
                        onClick={false}
                        colors={['#000', '#fff']}
                        strokeColor='#000'
                        data={[
                            {
                                label: 'Text',
                                value: datas.textAndImageCourses,
                            },
                            {
                                label: 'Video',
                                value: datas.videoAndTextCourses,
                            },
                        ]}
                    />
                    <DonutChart
                        className='md:hidden'
                        width={350}
                        height={300}
                        interactive={false}
                        onClick={false}
                        colors={['#000', '#fff']}
                        strokeColor='#000'
                        data={[
                            {
                                label: 'Text',
                                value: datas.textAndImageCourses,
                            },
                            {
                                label: 'Video',
                                value: datas.videoAndTextCourses,
                            },
                        ]}
                    />
                </div>

            </div>
        </div>

    );
};

export default DashboardCards;
