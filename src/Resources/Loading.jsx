import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loading = () => {
  // State for orbiting nodes and particle trails
  const [nodes, setNodes] = useState([]);
  const [trails, setTrails] = useState([]);

  // Generate nodes and trails on mount
  useEffect(() => {
    const newNodes = Array.from({ length: 8 }, (_, index) => ({
      id: index,
      angle: (index * 360) / 8, // Evenly spaced
      radius: Math.random() * 40 + 60, // Random radius between 60-100px
      size: Math.random() * 4 + 4,
      color: ['#AAC624', '#7BBF2A', '#4F391A'][Math.floor(Math.random() * 3)],
      speed: Math.random() * 4 + 4,
    }));
    setNodes(newNodes);

    const newTrails = Array.from({ length: 15 }, (_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      color: ['#AAC624', '#7BBF2A', '#aa783256'][Math.floor(Math.random() * 3)],
      delay: Math.random() * 2,
      speed: Math.random() * 2 + 2,
    }));
    setTrails(newTrails);
  }, []);

  // Variants for central orb
  const orbVariants = {
    pulse: {
      scale: [1, 1.3, 1],
      opacity: [0.9, 0.7, 0.9],
      boxShadow: [
        '0 0 20px rgba(170, 198, 36, 0.6)',
        '0 0 40px rgba(170, 198, 36, 0.9)',
        '0 0 20px rgba(170, 198, 36, 0.6)',
      ],
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
    },
  };

  // Variants for orbiting nodes
  const nodeVariants = {
    orbit: (custom) => ({
      x: [Math.cos(custom.angle * Math.PI / 180) * custom.radius, Math.cos((custom.angle + 360) * Math.PI / 180) * custom.radius],
      y: [Math.sin(custom.angle * Math.PI / 180) * custom.radius, Math.sin((custom.angle + 360) * Math.PI / 180) * custom.radius],
      scale: [1, 1.2, 1],
      opacity: [0.8, 0.6, 0.8],
      transition: {
        duration: custom.speed,
        repeat: Infinity,
        ease: 'linear',
      },
    }),
  };

  // Variants for connecting lines
  const lineVariants = {
    animate: {
      opacity: [0.4, 0.7, 0.4],
      transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
    },
  };

  // Variants for text
  const textVariants = {
    animate: {
      opacity: [1, 0.8, 1],
      y: [0, -4, 0],
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
    },
  };

  // Variants for particle trails
  const trailVariants = {
    float: (custom) => ({
      y: [0, -50],
      opacity: [0.6, 0],
      scale: [1, 0.5],
      transition: {
        duration: custom.speed,
        repeat: Infinity,
        delay: custom.delay,
        ease: 'easeOut',
      },
    }),
  };

  // Variants for background wave
  const waveVariants = {
    wave: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: { repeat: Infinity, duration: 6, ease: 'linear' },
    },
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white text-brown overflow-hidden">
      {/* Background Wave Effect */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(45deg, rgba(170, 198, 36, 0.1), rgba(170, 120, 50, 0.2), rgba(170, 198, 36, 0.1))',
          backgroundSize: '200% 200%',
        }}
        variants={waveVariants}
        animate="wave"
      />

      {/* Subtle FadeBrown Overlay */}
      <div className="absolute inset-0 bg-fadeBrown opacity-15 pointer-events-none" />

      {/* Constellation Container */}
      <div className="relative flex items-center justify-center w-72 h-72">
        {/* Central Orb */}
        <motion.div
          className="absolute w-24 h-24 bg-yellowGreen rounded-full shadow-[0_0_30px_rgba(170,198,36,0.8)]"
          variants={orbVariants}
          animate="pulse"
        />

        {/* Connecting Lines (SVG) */}
        <svg className="absolute w-full h-full" style={{ pointerEvents: 'none' }}>
          {nodes.map((node, i) =>
            nodes.slice(i + 1).map((otherNode, j) => (
              <motion.line
                key={`${node.id}-${otherNode.id}`}
                x1={Math.cos(node.angle * Math.PI / 180) * node.radius + 144} // Center at 144 (w-72/2)
                y1={Math.sin(node.angle * Math.PI / 180) * node.radius + 144}
                x2={Math.cos(otherNode.angle * Math.PI / 180) * otherNode.radius + 144}
                y2={Math.sin(otherNode.angle * Math.PI / 180) * otherNode.radius + 144}
                stroke="#4F391A"
                strokeWidth="1"
                opacity={0.4}
                variants={lineVariants}
                animate="animate"
              />
            ))
          )}
        </svg>

        {/* Orbiting Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            className="absolute rounded-full"
            style={{
              width: node.size,
              height: node.size,
              backgroundColor: node.color,
              top: '50%',
              left: '50%',
              boxShadow: `0 0 8px ${node.color}`,
            }}
            variants={nodeVariants}
            animate="orbit"
            custom={{ angle: node.angle, radius: node.radius, speed: node.speed }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <motion.p
        className="mt-12 text-2xl font-light tracking-widest text-brown "
        variants={textVariants}
        animate="animate"
      >
        Loading, please wait...
      </motion.p>

      {/* Particle Trails */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {trails.map((trail) => (
            <motion.div
              key={trail.id}
              className="absolute rounded-full"
              style={{
                width: trail.size,
                height: trail.size,
                backgroundColor: trail.color,
                top: `${trail.y}%`,
                left: `${trail.x}%`,
                boxShadow: `0 0 5px ${trail.color}`,
              }}
              variants={trailVariants}
              animate="float"
              custom={{ speed: trail.speed, delay: trail.delay }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Loading;