
class SocketError extends Error  {
    constructor(message,code) {
        super(message);
        this.name = "SocketError",
        this.code = code
    }
};

export default SocketError;