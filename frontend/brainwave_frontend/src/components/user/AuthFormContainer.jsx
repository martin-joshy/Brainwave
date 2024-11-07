import { Container } from '@mui/material';

function AuthFormContainer({ Form }) {
  return (
    <Container
      sx={{
        p: { xs: 0 },
      }}
    >
      <div className="h-max-[100vh] p-2 flex items-center justify-center">
        <div className="w-full max-w-7xl">
          <div className="relative w-full flex flex-col shadow-[0px_3px_20.25px_rgba(0,_0,_0,_0.25)] [backdrop-filter:blur(3.03px)] rounded-[39.43px] sm-max:rounded-none bg-powderblue overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                className="w-full h-full object-cover"
                alt=""
                src="/bg-design-1@2x.png"
              />
            </div>

            <div className="relative z-10 flex min-h-[100vh]">
              <div className="flex-1 md-min:w-1/2">
                <div className="relative z-10 pt-12 pb-2 md-min:pl-8 md-max:flex md-max:justify-center">
                  <div className="w-28 h-12 relative">
                    <img
                      className="w-full h-full object-contain"
                      loading="lazy"
                      alt="Logo"
                      src="/logo-2-1@2x.png"
                    />
                  </div>
                </div>
                <div className="pt-4 w-full h-full flex justify-center">
                  <Form />
                </div>
              </div>
              <div className="md-min:w-1/2 md-max:hidden">
                <img
                  className="h-full w-full object-cover rounded-tr-[39.43px] rounded-br-[39.43px]"
                  loading="lazy"
                  alt=""
                  src="/gatismarcinkevicsa5uptadumjeunsplash-1@2x.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default AuthFormContainer;
