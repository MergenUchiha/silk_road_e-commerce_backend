/* eslint-disable */
export default async () => {
    const t = {};
    return {
        '@nestjs/swagger': {
            models: [
                [
                    import('./modules/token/dto/userToken.dto'),
                    {
                        UserTokenDto: {
                            id: { required: true, type: () => String },
                            phoneNumber: { required: true, type: () => String },
                        },
                    },
                ],
                [
                    import('./libs/contracts/dto/user.dto'),
                    {
                        UserRegistrationDto: {},
                        UserLoginDto: {},
                        UserVerificationDto: {},
                    },
                ],
                [
                    import('./libs/contracts/dto/product.dto'),
                    { CreateProductDto: {}, UpdateProductDto: {} },
                ],
                [import('./libs/contracts/dto/page.dto'), { PageDto: {} }],
                [
                    import('./libs/contracts/dto/image.dto'),
                    { CreateImageDto: {} },
                ],
            ],
            controllers: [
                [
                    import('./utils/health/health.controller'),
                    { HealthController: { check: { type: Object } } },
                ],
                [
                    import('./modules/category/category.controller'),
                    {
                        ShopController: {
                            createShop: { type: Object },
                            getShops: { type: Object },
                            getOneShop: { type: Object },
                            updateShop: { type: Object },
                            deleteShop: { type: Object },
                            uploadShopImage: { type: Object },
                            deleteShopImage: { type: Object },
                        },
                    },
                ],
                [
                    import('./modules/product/product.controller'),
                    {
                        ProductController: {
                            createProduct: { type: Object },
                            getProducts: { type: Object },
                            getOneProduct: { type: Object },
                            updateProduct: { type: Object },
                            deleteProduct: { type: Object },
                            uploadProductImage: { type: Object },
                            deleteProductImage: { type: Object },
                        },
                    },
                ],
                [
                    import('./modules/client/auth/auth.controller'),
                    {
                        AuthController: {
                            userRegistration: { type: Object },
                            login: { type: Object },
                            userLogout: { type: Object },
                            userRefreshToken: { type: Object },
                            userVerification: { type: Object },
                            userResendVerificationCode: { type: Object },
                            getMe: { type: Object },
                        },
                    },
                ],
            ],
        },
    };
};
