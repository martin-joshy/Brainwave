function PasswordResetContainer({ Form }) {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="w-full h-full py-2 flex justify-center items-center">
        <div className="object-contain relative h-[590px] w-[450.2px] shadow-[0px_3px_20.25px_rgba(0,_0,_0,_0.25)] [backdrop-filter:blur(3.03px)] rounded-[39.43px] bg-powderblue ">
          <img
            className="w-full h-full z-[1]"
            alt=""
            src="/bg-design-1@2x.png"
          />
          <div className="py-8 pl-8 absolute top-[0px] w-full h-1/6 flex">
            <div className="w-[7rem] h-[3rem] relative  object-cover z-[3]">
              <img
                className="w-full h-full"
                loading="lazy"
                alt=""
                src="/logo-2-1@2x.png"
              />
            </div>
          </div>
          <div className="object-contain absolute bottom-0 w-full h-5/6 flex-1 flex justify-center">
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordResetContainer;
