const DoctorsCard = ({ doctor }) => {
  return (
    <div className="flex flex-col md:flex-row border border-purple-700 rounded-lg">
      <div>
        <img
          className="w-[400px] h-[350px] border border-purple-700 rounded-lg object-cover object-top "
          src={doctor.photo}
          alt=""
        />
      </div>
      <div className="w-full border border-purple-700 rounded-lg">
        <div className="pt-4 pl-4 pr-4 md:pt-6 md:pl-6 md:pr-6">
          <h4 className="text-2xl md:text-3xl text-purple-700 font-bold ">
            {doctor?.name}
          </h4>
          <p className="text-lg ">{doctor?.degree}</p>
          <p className="text-lg ">{doctor?.designation}</p>
          <p className="text-base mb-2">{doctor?.workplace}</p>
        </div>
        <hr className="border-t-1 border-purple-600 w-full " />
        <div>
          <h5 className="text-2xl text-center bg-purple-700 text-white p-1">Chambers </h5>
          <hr className="border-t-1 border-purple-600 w-full " />
          <div className="pt-4 pl-4 pr-4 md:pt-6 md:pl-6 md:pr-6 grid grid-cols-1 md:grid-cols-2">
            {doctor?.chambers?.map(chamber => (
              <div key={chamber?.appointment_contact}>
                <h5>Chamber Name: {chamber?.hospital_name}</h5>
                <p>Chamber Address: {chamber?.address}</p>
                <p>Visiting Time: {chamber?.visiting_hours?.original_text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsCard;
