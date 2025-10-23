const Logger = {
  info: function(message, meta){
    try { console.log(`[INFO] ${message}`, meta ?? ''); } catch(e) {}
  },
  warn: function(message, meta){
    try { console.warn(`[WARN] ${message}`, meta ?? ''); } catch(e) {}
  },
  error: function(message, err){
    try { console.error(`[ERROR] ${message}`, err); } catch(e) {}
  }
};

