import { Controller, Get, NotFoundException, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService
  ) { }

  @Get('/')
  @ApiExcludeEndpoint()
  @Render('index')
  async root() {
   
    const baseURL = this.configService.get('BASE_URL');
    return {  baseURL };
  }

  @Get('/about')
  @ApiExcludeEndpoint()
  @Render('pages/about')
  async about() {
  ;
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: 'About Us', url: '/about', active: true },
    ];

    return {
      title: 'About Us',
      imageSrc: '/public/img/working man4.webp', // Update with your actual image path
      breadcrumbs: breadcrumbs,
      
    };
  }

  @Get('/contacts')
  @ApiExcludeEndpoint()
  @Render('pages/contacts')
  async contact() {
    return {
      title: 'Contact Us',
      imageSrc: '/public/img/working man4.webp', // Adjust this path based on your actual image location
      breadcrumbs: [
        { label: 'Home', url: '/', active: false },
        { label: 'Contact Us', url: '/contacts', active: true },
      ],
    };
  }
  // Get product dynamic
  @Get('/product/:product_slug')
  @ApiExcludeEndpoint()
  @Render('pages/singleproduct')
  async singleproduct(@Param('product_slug') product_slug: string) {
    const baseURL = this.configService.get('BASE_URL');
    

    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: "jdb", url: `/products/${product_slug}`, active: true },
    ];

    return {
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      // imageSrc: `/public/uploads/${product.data.default_image}`, // Update with your actual product image path
      breadcrumbs: breadcrumbs,
      product: "jk",
      baseURL,
    };
  }

  @Get('category/:category_slug')
  @ApiExcludeEndpoint()
  @Render('pages/productcategory')
  async productcategory(@Param('category_slug') category_slug: string) {
    const baseURL = this.configService.get('BASE_URL');

    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
    ];
    return {
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      breadcrumbs: breadcrumbs,
     
      baseURL
    };
  }

  @Get('/certificates')
  @ApiExcludeEndpoint()
  @Render('pages/certificates')
  async certificates() {
    const baseURL = this.configService.get('BASE_URL');
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: 'Certificates', url: '/certificates', active: true },
    ];

    return {
      title: 'Certificates',
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      breadcrumbs: breadcrumbs,
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
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: 'Blog', url: '/blog', active: true },
    ];

    return {
      title: 'Blog',
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      breadcrumbs: breadcrumbs,
     
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
    const breadcrumbs = [
      { label: 'Home', url: '/', active: false },
      { label: 'Career', url: '/career', active: true },
    ];

    return {
      title: 'Career',
      imageSrc: '/public/img/working man4.webp', // Update with your actual product image path
      breadcrumbs: breadcrumbs,
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
