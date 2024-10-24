import { Controller, Get, NotFoundException, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { PublicapiService } from './publicapi/publicapi.service';
import { ConfigService } from '@nestjs/config';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly publicapiService: PublicapiService,
    private configService: ConfigService
  ) { }

  @Get('/')
  @ApiExcludeEndpoint()
  @Render('index')
  async root() {
    const products = await this.publicapiService.findAllProducts();
    const categories = await this.publicapiService.findAllCategories();
    const baseURL = this.configService.get('BASE_URL');
    return { products, categories, baseURL };
  }

  @Get('/about')
  @ApiExcludeEndpoint()
  @Render('pages/about')
  async about() {
    const categories = await this.publicapiService.findAllCategories();
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: 'About Us', url: '/about', active: true },
    ];

    return {
      title: 'About Us',
      imageSrc: '/public/img/working man4.webp', // Update with your actual image path
      breadcrumbs: breadcrumbs,
      categories
    };
  }

  @Get('/contacts')
  @ApiExcludeEndpoint()
  @Render('pages/contacts')
  async contact() {
    const categories = await this.publicapiService.findAllCategories();
    return {
      title: 'Contact Us',
      imageSrc: '/public/img/working man4.webp', // Adjust this path based on your actual image location
      breadcrumbs: [
        { label: 'Home', url: '/', active: false },
        { label: 'Contact Us', url: '/contacts', active: true },
      ],
      categories
    };
  }
  // Get product dynamic
  @Get('/product/:product_slug')
  @ApiExcludeEndpoint()
  @Render('pages/singleproduct')
  async singleproduct(@Param('product_slug') product_slug: string) {
    const baseURL = this.configService.get('BASE_URL');
    const product = await this.publicapiService.findProducts(product_slug);
    const categories = await this.publicapiService.findAllCategories();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: product.data.name, url: `/products/${product_slug}`, active: true },
    ];

    return {
      title: product.data.name,
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      // imageSrc: `/public/uploads/${product.data.default_image}`, // Update with your actual product image path
      breadcrumbs: breadcrumbs,
      product: product.data,
      categories,
      baseURL,
    };
  }

  @Get('category/:category_slug')
  @ApiExcludeEndpoint()
  @Render('pages/productcategory')
  async productcategory(@Param('category_slug') category_slug: string) {
    const baseURL = this.configService.get('BASE_URL');
    const categories = await this.publicapiService.findAllCategories();
    const selectedCategory = await this.publicapiService.findCategoryBySlug(category_slug);
    const products = await this.publicapiService.findAllProducts();
    const attributes = await this.publicapiService.findAttributes();
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: selectedCategory.data.category_name, url: `/${category_slug}`, active: true },
    ];
    return {
      title: selectedCategory.data.category_name, // dynamically set the title to the category name
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      breadcrumbs: breadcrumbs,
      categories,
      selectedCategory,
      products,
      attributes,
      baseURL
    };
  }

  @Get('/certificates')
  @ApiExcludeEndpoint()
  @Render('pages/certificates')
  async certificates() {
    const categories = await this.publicapiService.findAllCategories();
    const baseURL = this.configService.get('BASE_URL');
    const certificate = await this.publicapiService.findCertificates();
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: 'Certificates', url: '/certificates', active: true },
    ];

    return {
      title: 'Certificates',
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      breadcrumbs: breadcrumbs,
      categories,
      certificate,
      baseURL
    };
  }
  @Get('/blogpage')
  @ApiExcludeEndpoint()
  @Render('pages/blogpage')
  blogpage() {
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: 'Blog', url: '/blogpage', active: true },
    ];

    return {
      title: 'Blog',
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      breadcrumbs: breadcrumbs,
    };
  }
  @Get('/blog')
  @ApiExcludeEndpoint()
  @Render('pages/blog')
  async bloglist() {
    const categories = await this.publicapiService.findAllCategories();
    const blogs = await this.publicapiService.findBlogs();
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: 'Blog', url: '/blog', active: true },
    ];

    return {
      title: 'Blog',
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      breadcrumbs: breadcrumbs,
      categories,
      blogs
    };
  }
  @Get('/industries')
  @ApiExcludeEndpoint()
  @Render('pages/industries')
  industries() {
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: 'industries', url: '/industries', active: true },
    ];

    return {
      title: 'Industries',
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      breadcrumbs: breadcrumbs,
    };
  }
  @Get('/career')
  @ApiExcludeEndpoint()
  @Render('pages/career')
  async career() {
    const categories = await this.publicapiService.findAllCategories();
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: 'Career', url: '/career', active: true },
    ];

    return {
      title: 'Career',
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      breadcrumbs: breadcrumbs,
      categories
    };
  }
  @Get('/map')
  @ApiExcludeEndpoint()
  @Render('pages/map')
  map() {
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: 'map', url: '/map', active: true },
    ];

    return {
      title: 'map',
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      breadcrumbs: breadcrumbs,
    };
  }
}
