
import JoinForm from "./JoinForm";

const JoinFormSection = () => {
  return (
    <section id="join" className="section relative overflow-hidden bg-gradient-to-b from-white to-purple-50 py-24">
      {/* Decorative elements */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-pink-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <JoinForm />
      </div>
    </section>
  );
};

export default JoinFormSection;
