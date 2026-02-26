const dashboardCache = {
    stats: null,
    timestamp: null,
    clear: function () {
        this.stats = null;
        this.timestamp = null;
        console.log('🧹 Dashboard stats cache cleared');
    }
};

module.exports = { dashboardCache };
