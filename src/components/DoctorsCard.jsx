const DoctorsCard = ({ doctor }) => {
  return (
    <div className="flex flex-col md:flex-row border border-purple-700 rounded-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]">
      <div>
        <img
          className="w-[200] h-[200px] object-cover object-top border border-purple-700"
          style={{ borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}
          src={doctor.photo}
          alt=""
        />
      </div>
      <div
        className="w-full border border-purple-700 "
        style={{ borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}
      >
        <div className="p-2">
          <h4
            className="text-2xl text-purple-700 font-bold"
            title={doctor?.name}
          >
            {doctor?.name?.length > 30
              ? doctor.name.slice(0, 30) + '...'
              : doctor?.name}
          </h4>

          <p className="text-base">
            {doctor?.degree?.length > 50
              ? doctor.degree.slice(0, 50) + '...'
              : doctor?.degree}
          </p>
          <p className="text-base">
            {doctor?.designation?.length > 50
              ? doctor.designation.slice(0, 50) + '...'
              : doctor?.designation}
          </p>
          <p className="text-base">
            {doctor?.workplace?.length > 50
              ? doctor.workplace.slice(0, 50) + '...'
              : doctor?.workplace}
          </p>
        </div>
        <hr className="border-t-1 border-purple-600 w-full " />
        <div>
          <h5 className="text-lg text-center bg-purple-700 text-white p-1">
            Chambers
          </h5>
          <hr className="border-t-1 border-purple-600 w-full " />
          <div className="p-2">
            <div>
              <h5 title={doctor?.chambers[0]?.hospital_name}>
                Chamber Name:{' '}
                {doctor?.chambers[0]?.hospital_name?.length > 45
                  ? doctor.chambers[0].hospital_name.slice(0, 45) + '...'
                  : doctor?.chambers[0]?.hospital_name}
              </h5>

              <p title={doctor?.chambers[0]?.address}>
                Chamber Address:{' '}
                {doctor?.chambers[0]?.address?.length > 45
                  ? doctor.chambers[0].address.slice(0, 45) + '...'
                  : doctor?.chambers[0]?.address}
              </p>

              <p title={doctor?.chambers[0]?.visiting_hours?.original_text}>
                Visiting Time:{' '}
                {doctor?.chambers[0]?.visiting_hours?.original_text?.length > 45
                  ? doctor.chambers[0].visiting_hours.original_text.slice(
                      0,
                      45
                    ) + '...'
                  : doctor?.chambers[0]?.visiting_hours?.original_text}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2 mb-3">
            <button className="px-4 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-700 hover:text-white transition">
              View All Chamber
            </button>
            <button className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow-md hover:bg-purple-800 transition">
              Doctors Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsCard;
