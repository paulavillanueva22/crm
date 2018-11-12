<?php
namespace Empresa\Service;

use DBAL\Entity\Empresa;
use Empresa\Form\EmpresaForm;



/**
 * This service is responsible for adding/editing empresas
 * and changing empresa password.
 */
class EmpresaManager
{
    /**
     * Doctrine entity manager.
     * @var Doctrine\ORM\EntityManager
     */
    private $entityManager;  
    
    /**
     * PHP template renderer.
     * @var type 
     */
    private $viewRenderer;
    
    /**
     * Application config.
     * @var type 
     */
    private $config;
   
    /**
     * Constructs the service.
     */
    public function __construct($entityManager, $viewRenderer, $config) 
    {
        $this->entityManager = $entityManager;
        $this->viewRenderer = $viewRenderer;
        $this->config = $config;
    }
    
    public function setVencimientos($vencimientos){
        $this->vencimientos= $vencimientos;
    }
    
     public function getEmpresas(){
        $empresas=$this->entityManager->getRepository(Empresa::class)->findAll();
        return $empresas;
    }
    
  
    public function getEmpresaFromForm($form, $data){
        $form->setData($data);
            if($form->isValid()) {
                $data = $form->getData();
                $empresa = $this->addEmpresa($data);
            }
        return $empresa;
    }
    /**
     * This method adds a new empresa.
     */
    public function addEmpresa($data) 
    {
       
        $empresa = new Empresa();
        $empresa->setNombre($data['nombre_empresa']);        
        $this->entityManager->persist($empresa);
        $this->entityManager->flush();
        return $empresa;
    }
    
    public function createForm(){
        return new EmpresaForm('create', $this->entityManager,null);
    }
    
   public function formValid($form, $data){
       $form->setData($data);
       return $form->isValid();  
    }
       
   
   public function getFormForEmpresa($empresa) {

        if ($empresa == null) {
            return null;
        }
        $form = new EmpresaForm('update', $this->entityManager, $empresa);
        return $form;
    }
    
    
    public function getFormEdited($form, $empresa){
        $form->setData(array(
                    'nombre_empresa'=>$empresa->getNombre(),
                ));
    }

    /**
     * This method updates data of an existing empresa.
     */
    public function updateEmpresa($empresa, $form) 
    {      
        
        
        $data = $form->getData();
        $empresa->setNombre($data['nombre']);
        $empresa->setDireccion($data['direccion']);
        $empresa->setTelefono($data['telefono']);
        $empresa->setMail($data['mail']);
        $empresa->setMovil($data['movil']);
        $empresa->setFax($data['fax']);
        $empresa->setWeb($data['web']);
        $empresa->setCuit_cuil($data['cuit_cuil']);
        $vencimiento_cai = \DateTime::createFromFormat('d/m/Y', $data['vencimiento_cai']);
        $empresa->setVencimiento_cai ($vencimiento_cai);
        $empresa->setRazon_social($data['razon_social']);
        $empresa->setTipo_iva('tipo_iva');
        $empresa->setLocalidad($data['localidad']);
        $empresa->setProvincia($data['provincia']);
        $empresa->setPais($data['pais']);
        $empresa->setCP($data['CP']);
        $empresa->setParametro_vencimiento($data['parametro_vencimiento']);
        // Apply changes to database.
        $this->entityManager->flush();
     
        return true;
    }
    
    public function removeEmpresa($empresa)
    {
            $this->entityManager->remove($empresa);
            $this->entityManager->flush();
           
    }
} 