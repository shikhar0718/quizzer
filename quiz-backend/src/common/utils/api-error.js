class APIError extends Error{
    constructor(message,statusCode)
    {
        super(message);  // this will call the parent Error constructor
        this.statusCode= statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this,this.constructor);
    }
        static badRequest(message= "Bad Request"){
            return new APIError(message,400);
        }

        static unauthorized(message="Unauthorized Access"){
            return new APIError(message,401)
        }

        static pageNotFound(message= "Page Not Found"){
            return new APIError(message,412)
        }
        
        static conflict(message="Conflict"){
            return new APIError(message,409);
        }
        
        static forbidden(message="forbidden"){
            return new APIError(message,403)
        }

        static notFound(message="Resource not found"){
            return new APIError(message,404);
        }
}

export default APIError