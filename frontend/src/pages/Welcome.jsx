import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useUser } from '../context/UserContext';
import DarkModeToggle from '../components/common/DarkModeToggle';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const CursorTrail = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const TRAIL_LENGTH = 15;
  const PARTICLE_COUNT = 3;

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      setMousePosition({ x: clientX, y: clientY });
      
      // Update trail positions
      setTrail(prevTrail => {
        const newTrail = [...prevTrail, { x: clientX, y: clientY }];
        if (newTrail.length > TRAIL_LENGTH) {
          newTrail.shift();
        }
        return newTrail;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* Main cursor */}
      <motion.div
        className="absolute w-3 h-3 bg-blue-500/40 dark:bg-blue-400/40 rounded-full blur-sm"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
      
      {/* Trail particles */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, particleIndex) => (
        <div key={particleIndex}>
          {trail.map((pos, index) => {
            const delay = index * 2 + particleIndex * 5;
            const size = 4 - (index / TRAIL_LENGTH) * 2;
            const opacity = 0.4 - (index / TRAIL_LENGTH) * 0.3;
            
            return (
              <motion.div
                key={`${particleIndex}-${index}`}
                className="absolute rounded-full bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400"
                style={{
                  width: size,
                  height: size,
                  opacity,
                  filter: 'blur(1px)',
                }}
                animate={{
                  x: pos.x - size / 2,
                  y: pos.y - size / 2,
                }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 200,
                  delay: delay * 0.01,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Transform mouse position to orb movement
  const orb1X = useTransform(springX, [-500, 500], [-30, 30]);
  const orb1Y = useTransform(springY, [-500, 500], [-30, 30]);
  const orb2X = useTransform(springX, [-500, 500], [30, -30]);
  const orb2Y = useTransform(springY, [-500, 500], [30, -30]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX - window.innerWidth / 2);
      mouseY.set(clientY - window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGo = () => {
    if (user && user.token) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 relative overflow-hidden">
      <CursorTrail />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ x: orb1X, y: orb1Y }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
        />
        <motion.div
          style={{ x: orb2X, y: orb2Y }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
        />
      </div>

      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full text-center relative z-10"
      >
        <div className="mb-8">
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-6 py-2 text-sm font-semibold mb-6 shadow-lg"
          >
            Welcome to
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4"
          >
            Debit Manager
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed"
          >
            Effortlessly manage your debtors, track outstanding payments, and stay organized with a modern dashboard.
          </motion.p>
        </div>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGo}
          className="w-full py-4 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-200"
        >
          Go to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Welcome; 