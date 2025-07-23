import { ColorRing } from 'react-loader-spinner';

const CircleSpinner = () => {
  return (
    <div className="flex justify-center items-center py-8 md:py-14 z-50 ">
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#7e22ce', '#9333ea', '#a78bfa', '#c4b5fd', '#6b21a8']}
      />
    </div>
  );
};

export default CircleSpinner;
