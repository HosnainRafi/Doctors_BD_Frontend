import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircleSpinner from '../../components/Spinner/CircleSpinner';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import DoctorAbout from '../../components/DoctorAbout';
import ChamberDetails from '../../components/ChamberDetails';
import './DoctorDetails.css'
const DoctorDetails = () => {
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  let { id } = useParams();
  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(
        `https://doctors-bd-backend-five.vercel.app/api/v1/doctors/${id}`
      );
      let data = await res.json();
      setDoctorDetails(data.data);
      setLoading(false);
    })();
  }, [id]);
  if (loading) return <CircleSpinner />;
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
          <div className="col-span-4">
            <img
              className="md:w-[350px] md:h-[300px] w-20 h-[100px] rounded-3xl object-cover border-white border-[6px] shadow object-top"
              src={doctorDetails?.photo}
              alt=""
            />
          </div>
          <div className="col-span-8">
            <h1 className="text-xl font-bold md:text-3xl">
              {doctorDetails?.name}
            </h1>
            <p className="text-black-600 font-medium rounded-full bg-gray-100 text-gray-600">
              {doctorDetails?.degree}
            </p>
            <p className="text-black-600 font-medium rounded-full bg-gray-100 text-gray-600">
              {doctorDetails?.designation}
            </p>
            <p className="text-black-600 font-medium rounded-full bg-gray-100 text-gray-600">
              {doctorDetails?.workplace}
            </p>
            <div className="flex space-x-3 truncate mt-2">
              <p
                className="bg-purple-700 text-white px-4 py-[6px]  rounded-l-md flex items-center"
                title={doctorDetails?.specialty}
              >
                {doctorDetails?.specialty}
              </p>
              <svg
                style={{ marginLeft: '-2px' }}
                height="44"
                width="30"
                viewBox="0 0 11 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 0H8.26297C9.86036 0 10.8131 1.78029 9.92707 3.1094L6.7396 7.8906C6.29173 8.5624 6.29173 9.4376 6.7396 10.1094L9.92707 14.8906C10.8131 16.2197 9.86036 18 8.26297 18H0V0Z"
                  fill="#7E22CE"
                ></path>
              </svg>
            </div>
            <div className="mt-5">
              <p className="text-black-600 font-medium rounded-full bg-gray-100 text-gray-600">
                Hospital Name: {doctorDetails?.hospital_name}
              </p>
              <p className="text-black-600 font-medium rounded-full bg-gray-100 text-gray-600">
                District:{' '}
                {doctorDetails?.district?.charAt(0).toUpperCase() +
                  doctorDetails?.district?.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* 2nd part starts here  */}
        <div className="mt-8 md:mt-12">
          <Tabs>
            <TabList>
              <Tab>
                <p className="px-5 text-lg">About</p>
              </Tab>
              <Tab>
                <p className="px-5 text-lg">Chamber</p>
              </Tab>
            </TabList>

            <TabPanel>
              <DoctorAbout doctorDetails={doctorDetails} />
            </TabPanel>
            <TabPanel>
              <ChamberDetails ChamberData={doctorDetails?.chambers} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
