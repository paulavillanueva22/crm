<?php
namespace Evento\Service;

use DBAL\Entity\Evento;
use DBAL\Entity\Cliente;
use DBAL\Entity\Ejecutivo;
use DBAL\Entity\TipoEvento;
use DBAL\Entity\Transaccion;
use Zend\Paginator\Paginator;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;

/**
 * This service is responsible for adding/editing eventos
 * and changing evento password.
 */
class EventoVentaManager extends EventoManager
{
    /**
     * Doctrine entity manager.
     * @var Doctrine\ORM\EntityManager
     */
    private $entityManager;  
    
    
    /**
     * Constructs the service.
     */
    public function __construct($entityManager, $personaManager) 
    {
        $this->entityManager = $entityManager;
        parent::__construct($entityManager, $personaManager);
    }
    
    
    // public function getEventosFiltrados($parametros) {
    //     $filtros = $this->limpiarParametros($parametros);
    //     $query = $this->busquedaPorFiltros($filtros);
    //     $adapter = new DoctrineAdapter(new ORMPaginator($query));
    //     $paginator = new Paginator($adapter);
    //     return $paginator;
    // }

    public function getEventosFiltrados($parametros) {
        $filtros = $this->limpiarParametros($parametros);
        $query = $this->busquedaPorFiltros($filtros);

        return $query->getResult();
    }
    
    public function getTotalFiltrados($parametros) {
        $filtros = $this->limpiarParametros($parametros);
        $query = $this->busquedaPorFiltros($filtros);
        $adapter = new DoctrineAdapter(new ORMPaginator($query));
        return $adapter;
    }

    public function busquedaPorFiltros($parametros) {
        $entityManager = $this->entityManager;
        $emConfig = $this->entityManager->getConfiguration();
        $emConfig->addCustomDatetimeFunction('YEAR', 'DoctrineExtensions\Query\Mysql\Year');
        $emConfig->addCustomDatetimeFunction('MONTH', 'DoctrineExtensions\Query\Mysql\Month');
        $emConfig->addCustomDatetimeFunction('DAY', 'DoctrineExtensions\Query\Mysql\Day');
        $queryBuilder = $entityManager->createQueryBuilder();
        $queryBuilder->select('E')
                ->from(Evento::class, 'E');
        $indices = array_keys($parametros);
        for ($i = 0; $i < count($indices); $i++) {
            $p = $i + 1;
            $nombreCampo = $indices[$i]; 
            if($nombreCampo=="tipo"){
                $valorCampo=$parametros['tipo']; 
                $queryBuilder->andWhere('E.tipo = :tipo')->setParameter('tipo',$valorCampo);
            }
            if($nombreCampo=="tipo_persona"){
                $valorCampo=$parametros['tipo_persona'];


                $queryBuilder->andWhere('E.tipo_persona = :tipoP')->setParameter('tipoP',$valorCampo);
            }
            if($nombreCampo=="ventas_m"){
                $valorCampo=$parametros['ventas_m'];
                $queryBuilder->andWhere('MONTH(E.fecha) = :month')->setParameter('month',$valorCampo);
            }
            if($nombreCampo=="ventas_y"){
                $valorCampo=$parametros['ventas_y'];
                $queryBuilder->andWhere('YEAR(E.fecha) = :year')->setParameter('year',$valorCampo);
            }
        }
        $queryBuilder ->orderBy('E.fecha', 'DESC')
                        ->orderBy('E.id', 'DESC');
                        
        return $queryBuilder->getQuery();
    }

    private function getEventosParticulares($result, $tipo){
        $salida = Array();
        foreach ($result as $evento):
            if ($evento->getPersona()->getTipo()==$tipo){
                array_push($salida, $evento);
            }
        endforeach;
        return $salida;
    }
   
    public function limpiarParametros($param) {
        foreach ($param as $filtro => $valor) {
            if (empty($valor)) {
                unset($param[$filtro]);
            } else {
                trim($param[$filtro]);
            }
        }
        return ($param);
    }
    
    private function getValor($parametros, $nombreCampo){
        if ($nombreCampo=="ejecutivo"){              
               return $this->entityManager->getRepository(Ejecutivo::class)->findOneBy(array('nomusr' => $parametros[$nombreCampo]));
        }
        if ($nombreCampo == "apellido_cliente"){
            $valor= $parametros[$nombreCampo];
            $nombreCampo= "cliente";           
            return $this->entityManager->getRepository(Cliente::class)->findOneBy(array('apellido' => $parametros["apellido_cliente"]));
        }
        if ($nombreCampo == "nombre_cliente"){
            $nombreCampo="cliente";
            return $this->entityManager->getRepository(Cliente::class)->findOneBy(array('nombre' => $parametros[$nombreCampo]));
        }
        if ($nombreCampo == "fecha"){
            return $parametros[$nombreCampo];
        }
        if ($nombreCampo=="tipo"){
             return $this->entityManager->getRepository(TipoEvento::class)->findOneBy(array('nombre' => $parametros[$nombreCampo]));
        }
        
    }
    
    public function getTipoEvento($id=null){
        if (isset ($id)) {
            return $this->entityManager
                ->getRepository(TipoEvento::class)
                ->findOneBy(['id_tipo_evento'=>$id]);
        }
        return $this->entityManager
                ->getRepository(TipoEvento::class)
                ->findAll();
    }

    public function getTransacciones(){
        return $this->entityManager
                ->getRepository(Transaccion::class)
                ->findAll();
    }
 
} 