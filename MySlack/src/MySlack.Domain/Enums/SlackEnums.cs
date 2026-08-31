namespace MySlack.Domain.Enums;

public enum UserStatus
{
    Active = 0,
    Away = 1,
    InHuddle = 2,
    DoNotDisturb = 3,
    Offline = 4
}

public enum ChannelType
{
    Public = 0,
    Private = 1,
    DirectMessage = 2
}

public enum MemberRole
{
    Admin = 0,
    Member = 1,
    Guest = 2
}
