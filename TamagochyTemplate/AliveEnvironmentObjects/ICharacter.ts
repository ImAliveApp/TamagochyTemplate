interface ICharacter {
    Name: string;
    Id: string;

    //use AgentConstants.X_CATEGORY to compare with the category that you need.
    Category: string;

    DownloadsCount: number;
    VotesCount: number;
    IsRecommended: boolean;
}