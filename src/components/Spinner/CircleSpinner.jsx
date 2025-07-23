import { ColorRing } from 'react-loader-spinner';

const CircleSpinner = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
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
