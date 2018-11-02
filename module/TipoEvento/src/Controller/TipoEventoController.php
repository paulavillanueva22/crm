<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace TipoEvento\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;
use DoctrineORMModule\Paginator\Adapter\DoctrinePaginator as DoctrineAdapter;
use Doctrine\ORM\Tools\Pagination\Paginator as ORMPaginator;
use Zend\Paginator\Paginator;
use Application\Entity\Post;
use DBAL\Entity\TipoEvento;
use TipoEvento\Form\TipoEventoForm;

class TipoEventoController extends AbstractActionController {

    /**
     * @var DoctrineORMEntityManager
     */
    protected $entityManager;

    /**
     * TipoEvento manager.
     * @var User\Service\TipoEventoManager 
     */
    protected $tipoeventoManager;

    /**
     * Doctrine entity manager.
     * @var Doctrine\ORM\EntityManager
     */
    private $eventoManager;

    /* public function __construct($entityManager, $tipoeventoManager)
      {
      $this->entityManager = $entityManager;
      $this->tipoeventoManager = $tipoeventoManager;
      }
     */

    public function __construct($entityManager, $tipoeventoManager, $eventoManager) {
        $this->entityManager = $entityManager;
        $this->tipoeventoManager = $tipoeventoManager;
        $this->eventoManager = $eventoManager;
    }

    public function indexAction() {
        $view = $this->procesarAddAction();
        return $view;
    }

    private function procesarIndexAction() {
        $tipoeventos = $this->tipoeventoManager->getTipoEventos();
        return new ViewModel([
            'tipoeventos' => $tipoeventos
        ]);
    }

    public function addAction() {
        $view = $this->procesarAddAction();
        return $view;
    }

    private function procesarAddAction() {
        $form = $this->tipoeventoManager->createForm();
        $tipoeventos = $this->tipoeventoManager->getTipoEventos();

        $paginator = $this->tipoeventoManager->getTabla();
        $mensaje = "";

        $page = 1;
        if ($this->params()->fromRoute('id')) {
            $page = $this->params()->fromRoute('id');
        }
        $paginator->setCurrentPageNumber((int) $page)
                ->setItemCountPerPage(10);

        if ($this->getRequest()->isPost()) {
            $data = $this->params()->fromPost();
            $tipoevento = $this->tipoeventoManager->getTipoEventoFromForm($form, $data);
            return $this->redirect()->toRoute('tipoevento');
        }
        return new ViewModel([
            'form' => $form,
            'tipoeventos' => $tipoeventos,
            'tipoeventos_pag' => $paginator,
            'mensaje' => $mensaje
        ]);
    }

    public function editAction() {
        $view = $this->procesarEditAction();
        return $view;
    }

    public function procesarEditAction() {
        $id = (int) $this->params()->fromRoute('id', -1);
        $tipoevento = $this->tipoeventoManager->getTipoEventoId($id);
        $form = $this->tipoeventoManager->getFormForTipoEvento($tipoevento);
        if ($form == null) {
            $this->reportarError();
        } else {
            if ($this->getRequest()->isPost()) {
                $data = $this->params()->fromPost();
                if ($this->tipoeventoManager->formValid($form, $data)) {
                    $this->tipoeventoManager->updateTipoEvento($tipoevento, $form);
                    return $this->redirect()->toRoute('tipoevento');
                }
            } else {
                $this->tipoeventoManager->getFormEdited($form, $tipoevento);
            }
            return new ViewModel(array(
                'tipoevento' => $tipoevento,
                'form' => $form
            ));
        }
    }

    public function removeAction() {
        $view = $this->procesarRemoveAction();
        return $view;
    }

    public function procesarRemoveAction() {
        $id = (int) $this->params()->fromRoute('id', -1);
        $tipoevento = $this->tipoeventoManager->getTipoEventoId($id);

        if ($tipoevento == null) {
            $this->reportarError();
        } else {
            $this->eventoManager->eliminarTipoEventos($tipoevento->getId());
            $this->tipoeventoManager->removeTipoEvento($tipoevento);
            return $this->redirect()->toRoute('tipoevento');
        }
    }

    public function viewAction() {
        return new ViewModel();
    }

    private function reportarError() {
        $this->getResponse()->setStatusCode(404);
        return;
    }

}
