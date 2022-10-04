declare module '@ioc:Adonis/Core/Static' {
    type AssetsConfig = {
        enabled: boolean;
        acceptRanges?: boolean;
        cacheControl?: boolean;
        dotFiles?: 'ignore' | 'allow' | 'deny';
        etag?: boolean;
        lastModified?: boolean;
        maxAge?: number | string;
    };
}
