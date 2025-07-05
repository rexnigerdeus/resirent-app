// src/components/Layout/PageLayout.jsx

const PageLayout = ({ children, bgImage }) => {
  // Define the style object for the background image
  const style = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed', // This creates a nice parallax-like effect
  };

  return (
    <div style={bgImage ? style : {}}>
      {/* This overlay is crucial. It adds a semi-transparent layer
        on top of the background image, making the text on top of it
        much more readable. You can adjust the color and opacity.
      */}
      <div className="min-h-screen">
        {/*
          The `pt-16` here is important because our navbar is 4rem (h-16) tall
          and sticky. This padding prevents the page content from being hidden
          underneath the navbar.
        */}
        <div className="pt-16">
          {children} {/* This is where your actual page content will be rendered */}
        </div>
      </div>
    </div>
  );
};

export default PageLayout;