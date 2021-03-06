function showToast(title, time = 1000, type = 'none') {
    uni.showToast({
        title: title,
        icon: type,
        duration: time
    });
}
function showLoading(title) {
    uni.showLoading({
        title: title,
        mask: true,
        duration: 5000
    });
}
module.exports = {
    showToast,
    showLoading,
}