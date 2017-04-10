interface IRestManager {

    /**
     * This method will start the user verification procedure.
     * For more information, please visit this link:
     * https://github.com/ImAliveApp/ImAliveGuide/wiki/Rest-Manager#verifyuseridentity
     */
    verifyUserIdentity(): void;

    /**
     * This method will perform a POST operation to your server.
     * @param path The path to POST.
     * @param json A json representation of the object to post (it will be available in the message body).
     */
    postObject(path: string, json: string): void;

    /**
     * This method will perform a GET operation to your server.
     * @param path The path to GET.
     */
    getObject(path: string): void;
}