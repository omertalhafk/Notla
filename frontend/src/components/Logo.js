import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div className="notla-logo" whileHover={{ rotate: 5 }} transition={{ type: 'spring', stiffness: 200 }}>
      <span>N</span>
    </motion.div>
  );
};

export default Logo;

