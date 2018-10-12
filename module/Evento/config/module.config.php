<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Evento;

use Doctrine\ORM\Mapping\Driver\AnnotationDriver;
use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;
use Application;


return [
   
   'router' => [
        'routes' => [
            'evento' => [
                'type'    => Segment::class,
                'options' => [
                    'route' => '/evento[/:action[/:id]]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id' => '[a-zA-Z0-9_-]*',
                    ],
                    'defaults' => [
                        'controller' => Controller\EventoController::class,
                        'action' => 'index',
                    ],
                ],
                'may_terminate' => true,
                'child_routes' => [
                    'editar' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/edit[/:id]',
                            'defaults' => [
                                'action' => 'edit',
                            ],
                            'constraints' => [
                                'id' => '[0-9]\d*',
                            ],
                        ],
                    ],
                    'agregar' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/add[/:id]',
                            'defaults' => [
                                'action' => 'add',
                            ],
                        ],
                    ],
                    'borrar' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/delete[/:id]',
                            'defaults' => [
                                'action' => 'delete',
                            ],
                            'constraints' => [
                                'id' => '[0-9]\d*',
                            ],
                        ],
                    ],
                    'buscar' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/seach',
                            'defaults' => [
                                'action' => 'search',
                            ],
                        ],
                    ],
                    'page' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/page[/:id]',
                            'defaults' => [
                                'action' => 'index',
                            ],
                            'constraints' => [
                                'id' => '[0-9]\d*',
                            ],
                        ],
                    ],
//                    'pageventas' => [
//                        'type' => Segment::class,
//                        'options' => [
//                            'route' => '/pageventas[/:id]',
//                            'defaults' => [
//                                'controller' => Controller\EventoVentaController::class,
//                                'action' => 'index',
//                            ],
//                            'constraints' => [
//                                'id' => '[0-9]\d*',
//                            ],
//                        ],
//                    ],
//                    'ventas' => [
//                        'type' => Segment::class,
//                        'options' => [
//                            'route' => '/ventas[/:id]',
//                            'defaults' => [
//                                'controller' => Controller\EventoVentaController::class,
//                                'action' => 'index',
//                            ],
//                            'constraints' => [
//                                'id' => '[0-9]\d*',
//                            ],
//                        ],
//                    ],
//                ],
                ],
                        
                ],
            'pageventas' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/pageventas[/:id]',
                            'defaults' => [
                                'controller' => Controller\EventoVentaController::class,
                                'action' => 'index',
                            ],
                            'constraints' => [
                                'id' => '[0-9]\d*',
                            ],
                        ],
                    ],
                    'ventas' => [
                        'type' => Segment::class,
                        'options' => [
                            'route' => '/ventas[/:id]',
                            'defaults' => [
                                'controller' => Controller\EventoVentaController::class,
                                'action' => 'index',
                            ],
                            'constraints' => [
                                'id' => '[0-9]\d*',
                            ],
                        ],
                    ],
            ],
        ],
   
   
 'controllers' => array(
        'factories' => [
            Controller\EventoController::class => Controller\Factory\EventoControllerFactory::class,
            Controller\EventoVentaController::class => Controller\Factory\EventoVentaControllerFactory::class,

        ],
     ),
     'view_manager' => array(
         'template_path_stack' => array(
             'evento' => __DIR__ . '/../view',
         ),
     ),
    'service_manager' => array(
        'factories' => array(
            Service\EventoManager::class => Service\Factory\EventoManagerFactory::class,
            Service\EventoVentaManager::class => Service\Factory\EventoVentaManagerFactory::class,

        ),
    )
 ];

