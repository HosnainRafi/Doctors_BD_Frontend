const DoctorCard = ({ doctor }) => {
  return (
    <div>
      <div className="p-4 flex flex-col md:flex-row gap-4 md:gap-6  border border-r-black-100 border-b-black-100 bg-white rounded-lg md:rounded-2xl md:shadow-none md:border md:border-[#E3E3E3] px-4 py-3 md:gap-x-4 md:hover:border-primary-600 hover:shadow-lg cursor-pointer hover:border-purple-700">
        <div>
          <div>
            <img
              className=" rounded-lg w-32 h-44  object-cover object-top "
              src={doctor.photo}
              alt=""
            />
          </div>
          <div></div>
        </div>
        <div>
          <div>
            <h4 className="text-xl font-semibold truncate" title={doctor?.name}>
              {doctor?.name}
            </h4>
            <p className="text-xs md:text-base pb-0 md:pb-2 overflow-hidden">
              {doctor?.degree}
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
