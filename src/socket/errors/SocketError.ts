
class SocketError extends Error  {
    constructor(message:string,public code:string) {
        super(message);
        this.name = "SocketError"
    }
};

export default SocketError;