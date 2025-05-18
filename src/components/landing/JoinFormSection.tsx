import JoinForm from "./JoinForm";

const JoinFormSection = () => {
  return (
    <section id="join" className="section relative overflow-hidden bg-gym-black py-24">
      {/* Decorative elements */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-gym-yellow/5 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-gym-yellow/5 rounded-full opacity-30 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-gym-yellow text-3xl md:text-4xl lg:text-5xl font-bold neon-text">
            Join Our Women-only Weight Loss Program
          </h2>
          <div className="w-24 h-1 bg-gym-yellow mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(255,243,24,0.7)]"></div>
          <p className="text-white mt-4 max-w-2xl mx-auto">
            Take the first step towards a healthier you with our personalized fitness program designed exclusively for women.
          </p>
        </div>
        
        <div className="bg-gym-black border-2 border-gym-yellow/30 hover:border-gym-yellow/60 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(255,243,24,0.15)] p-6 md:p-8 max-w-3xl mx-auto">
          <JoinForm />
        </div>
      </div>
    </section>
  );
};

export default JoinFormSection;
