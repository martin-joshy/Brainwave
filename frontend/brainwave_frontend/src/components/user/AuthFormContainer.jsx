function AuthFormContainer({ Form }) {
  return (
    <div className="container w-screen h-[680px] p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14">
      <div className="object-contain relative h-full w-full shadow-[0px_3px_20.25px_rgba(0,_0,_0,_0.25)] [backdrop-filter:blur(3.03px)] rounded-[39.43px] bg-powderblue ">
        <img className="w-full h-full z-[1]" alt="" src="/bg-design-1@2x.png" />
        <div className="py-8 pl-8 absolute top-[0px] w-full h-1/6 flex md-max:justify-center">
          <div className="w-[7rem] h-[3rem] relative  object-cover z-[3]">
            <img
              className="w-full h-full"
              loading="lazy"
              alt=""
              src="/logo-2-1@2x.png"
            />
          </div>
        </div>
        <div className="object-contain absolute bottom-0 md-max:w-full md-min:w-1/2 h-5/6 flex-1 flex justify-center">
          <Form />
        </div>

        <img
          className="absolute h-full w-1/2 top-[0px] bottom-[0px] right-[0px] rounded-tl-none rounded-tr-[39.43px] rounded-br-[39.43px] rounded-bl-none max-h-full object-cover z-[1] md-max:hidden"
          loading="lazy"
          alt=""
          src="/gatismarcinkevicsa5uptadumjeunsplash-1@2x.png"
        />
      </div>
    </div>
  );
}

export default AuthFormContainer;
