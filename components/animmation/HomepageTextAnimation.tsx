import { TypeAnimation } from "react-type-animation"

const HomepageTextAnnimation = () => {
  return (
    <div className="z-10 text-white">
      {/* First TypeAnimation */}
      <div className="mb-4">
        <TypeAnimation
          sequence={["Most Effective AI - powered Kids Assistant", 3000]}
          wrapper="h4"
          speed={40}
          style={{
            fontSize: "1.7em",
            fontWeight: "bold",
            background:
              "linear-gradient(45deg,rgb(75, 202, 227),rgb(243, 239, 241),rgb(125, 140, 176))",
            backgroundClip: "text",
            color: "transparent",
            WebkitBackgroundClip: "text",
            display: "inline-block"
          }}
          repeat={1}
        />
      </div>

      {/* Second TypeAnimation */}
      <div>
        <TypeAnimation
          sequence={[
            3000,
            "Make your children Smarter",
            3000,
            "Grow With Use Of AI",
            3000,
            "Chat, Learn, and Explore with AI",
            3000
          ]}
          wrapper="h1"
          speed={50}
          style={{
            fontSize: "2em",
            fontWeight: "bold",
            background: "linear-gradient(45deg, #ff007f, #00f5e9, #ffac41)",
            backgroundClip: "text",
            color: "transparent",
            WebkitBackgroundClip: "text",
            display: "inline-block"
          }}
          repeat={Infinity}
        />
      </div>
    </div>
  )
}

export default HomepageTextAnnimation
