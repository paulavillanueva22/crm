<?php
namespace Remito\Controller\Factory;

use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;
use Remito\Controller\RemitoController;
use Remito\Service\RemitoManager;
use Persona\Service\PersonaManager;
use Moneda\Service\MonedaManager;
use Proveedor\Service\ProveedorManager;
use Clientes\Service\ClientesManager;
use BienesTransacciones\Service\BienesTransaccionesManager;
use Bienes\Service\BienesManager;
use FormaPago\Service\FormaPagoManager;
use Iva\Service\IvaManager;

// use Transaccion\Service\TransaccionManager;

/**
 * Description of RemitoControllerFactory
 *
 * @author SoftHuella
 */
class RemitoControllerFactory implements FactoryInterface {
    

    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
       
        $remitoManager = $container->get(RemitoManager::class);
        $monedaManager = $container->get(MonedaManager::class);    
        $personaManager = $container->get(PersonaManager::class);            
        $clientesManager = $container->get(ClientesManager::class);            
        $proveedorManager = $container->get(ProveedorManager::class);
        $bienesTransaccionesManager = $container->get(BienesTransaccionesManager::class);
        $bienesManager = $container->get(BienesManager::class);
        $formaPagoManager = $container->get(FormaPagoManager::class);
        $ivaManager = $container->get(IvaManager::class);


        // $transaccionManager = $container->get(TransaccionManager::class);            


        // Instantiate the service and inject dependencies
        return new RemitoController($remitoManager,  $monedaManager, $personaManager, $clientesManager, 
        $proveedorManager,$bienesTransaccionesManager, $bienesManager, $formaPagoManager, $ivaManager);
    }    
}
